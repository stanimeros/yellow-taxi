<?php
    require ("functions.php");
    require ("keys.php");

    $servername = "localhost";
    $dbname = $keys['dbname'];
    $username = $keys['username'];
    $password = $keys['password'];

	$current_url = $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    if (strpos($current_url, 'localhost') !== false) {
        require ("cors_bypass.php");

        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "taxi";
    }

    if(!isset($_SESSION)) 
    { 
        session_start(); 
    } 

    $conn = mysqli_connect($servername, $username, $password, $dbname);

    if (!$conn) {
      die("Error: " . mysqli_connect_error());
    }

    mysqli_set_charset($conn, "utf8");
?>