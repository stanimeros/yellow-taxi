<?php
    if (isset($_GET["input"])) {
        require("connect.php");

        print_r(json_encode(getPredictions($_GET["input"], $conn)));
        $conn -> close();
    }
?>
