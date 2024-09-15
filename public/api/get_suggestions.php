<?php
    require ("connect.php");

    if (isset($_GET["input"])) {
        print_r(json_encode(getSuggestions($_GET["input"], $conn)));
    }

    $conn -> close();
?>
