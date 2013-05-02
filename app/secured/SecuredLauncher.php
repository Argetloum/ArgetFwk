<?php

session_start();
define('BACKOFFICE_ACTIVE', '');
define('PATH_TO_IMPORTANT_FILES', '../../');

require_once '../HttpCore.php';
require_once '../config.php';

/*
 * Appel aux classes utiles du Fwk
 */
require_once PATH_TO_IMPORTANT_FILES . 'lib/Resources/bin/FwkLoader.php';
require_once 'lib/SecuredClass.php';

FwkLoader::getContext();
$em = FwkLoader::getEntityManager();

if (is_file($_GET['path'] . DIRECTORY_SEPARATOR . $_GET['page'] . '.php')) {

    require_once $_GET['path'] . DIRECTORY_SEPARATOR . $_GET['page'] . '.php';
    $object = new $_GET['path']($em);
    $object->execute();
    unset($object);
    
}else{
    throw new Exception('Le fichier '.$_GET['page'].'.php n\'existe pas dans le dossier '.$_GET['path']);
}
?>
