<?php
    require ("connect.php");

    if (isset($_GET["token"])) {
        $sql = "UPDATE trips SET paid = 1 WHERE token = ?;";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $_GET["token"]);
        $stmt->execute();
        $stmt->close();
    }

    $conn -> close();
    header("Location: https://yellow-van.stanimeros.com/success");
    exit; 
?>
