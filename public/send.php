<?php
/**
 * PestGuard Pro – contact form handler for the JumpBG (cPanel) hosting.
 *
 * Sends the request from the website form straight to the company mailbox,
 * which is read in Webmail. The mailbox is info@<site domain> unless TO_EMAIL is set.
 * Responds with JSON: {"ok":true} or {"ok":false,"error":"..."}.
 */

// Mailbox that receives the requests. Leave empty to use info@<the site's domain>.
const TO_EMAIL = '';
// Max requests per visitor IP per hour (simple spam protection)
const RATE_LIMIT = 5;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function reply(bool $ok, string $error = '', int $code = 200): void {
    http_response_code($code);
    echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => $error], JSON_UNESCAPED_UNICODE);
    exit;
}

// Removes line breaks so nothing can be injected into the e-mail headers
function one_line(string $s, int $max): string {
    return mb_substr(trim(preg_replace('/[\r\n\t]+/', ' ', $s)), 0, $max);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    reply(false, 'method', 405);
}

// Bots fill the hidden "botcheck" field – pretend success and drop it
if (!empty($_POST['botcheck'])) {
    reply(true);
}

$name    = one_line($_POST['name'] ?? '', 100);
$phone   = one_line($_POST['phone'] ?? '', 40);
$town    = one_line($_POST['town'] ?? '', 60);
$lang    = ($_POST['lang'] ?? 'bg') === 'en' ? 'en' : 'bg';
$message = mb_substr(trim($_POST['message'] ?? ''), 0, 3000);

if ($name === '' || $phone === '' || !preg_match('/[0-9]{6,}/', preg_replace('/\D/', '', $phone))) {
    reply(false, 'invalid', 422);
}

// Rate limit per IP (stored in the system temp folder)
$ipKey = sys_get_temp_dir() . '/pg_form_' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'x');
$now = time();
$hits = [];
if (is_file($ipKey)) {
    $hits = array_filter(explode(',', (string) @file_get_contents($ipKey)), fn ($t) => $t !== '' && $now - (int) $t < 3600);
}
if (count($hits) >= RATE_LIMIT) {
    reply(false, 'too_many', 429);
}
$hits[] = $now;
@file_put_contents($ipKey, implode(',', $hits), LOCK_EX);

// Recipient and sender use the site's own domain, so the mail passes SPF/DKIM checks
$domain = strtolower(preg_replace('/^www\./', '', explode(':', $_SERVER['HTTP_HOST'] ?? '')[0]));
if (!preg_match('/^[a-z0-9.-]+\.[a-z]{2,}$/', $domain)) {
    reply(false, 'domain', 500);
}
$to   = TO_EMAIL !== '' ? TO_EMAIL : "info@$domain";
$from = "info@$domain";

$subject = 'Запитване от сайта' . ($lang === 'en' ? ' (EN)' : '') . ' – ' . ($town !== '' ? $town : 'без населено място');
$body = "Ново запитване от сайта PestGuard Pro\n"
      . "------------------------------------\n\n"
      . "Име: $name\n"
      . "Телефон: $phone\n"
      . "Населено място: $town\n"
      . "Език на сайта: " . ($lang === 'en' ? 'английски' : 'български') . "\n\n"
      . "Съобщение:\n" . ($message !== '' ? $message : '(няма)') . "\n\n"
      . "------------------------------------\n"
      . 'Изпратено на ' . date('d.m.Y H:i') . ' от ' . ($_SERVER['REMOTE_ADDR'] ?? '') . "\n";

$encode = fn (string $s) => '=?UTF-8?B?' . base64_encode($s) . '?=';
$headers = [
    'From: ' . $encode('PestGuard Pro – сайт') . " <$from>",
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PestGuardPro-site',
];

$sent = mail($to, $encode($subject), $body, implode("\r\n", $headers), "-f$from");
$sent ? reply(true) : reply(false, 'mail', 500);
