<?php
session_start();

include "../twitteroauth.php";

define('CONSUMER_KEY','uB38cnC4nzTCljfGSZ6ocg');
define('CONSUMER_SECRET' ,'u8ir51g3BqDcuvoQPlstuUhhyrLgicKvloYJfOD8Dus');
define("OAUTH_CALLBACK", "http://www.suite-logique.fr/test/back//twitteroauth/TwitterConnection/callback.php");

/* Cr�er une connexion avec Twitter */
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);

$urlRedi = OAUTH_CALLBACK;

/* On demande les tokens � Twitter, et on passe notre url de callback */
$request_token = $connection->getRequestToken($urlRedi);

/* On sauvegarde ces informations en session */
$_SESSION['oauth_token'] = $token = $request_token['oauth_token'];
$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];

/* On v�rifie que notre requ�te pr�c�dente a correctement fonctionn� */
switch ($connection->http_code) {
case 200:
/* On construit l'URL de callback avec les tokens en param�tres */
$url = $connection->getAuthorizeURL($token);
header('Location: ' .$urlRedi);
break;
default:
$contenu= '<div class="error">Impossible de se connecter � twitter...</div>';
break;
}
?> 