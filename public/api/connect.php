<?php
    require("functions.php");

    $servername = "localhost";
    $dbname = $keys['dbname'];
    $username = $keys['username'];
    $password = $keys['password'];

    $current_url = $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    if (strpos($current_url, 'localhost') !== false) {
        error_reporting(E_ALL);
        ini_set('display_errors', 1);
        require("cors_bypass.php");

        $dbname = "taxi";
        $username = "root";
        $password = "";
    }else{
        session_start();
    }

    $conn = mysqli_connect($servername, $username, $password, $dbname);
    if (!$conn) {
        echo json_encode(['status' => 'failed', 'message' => 'Connection error: ' . mysqli_connect_error()]); 
        exit();
    }
    mysqli_set_charset($conn, "utf8mb4");
?> 