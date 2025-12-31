<?php
// Your desired password
$password = 'diyah123';

// Generate the hash using the BCRYPT algorithm
// This will result in a string starting with $2y$
$hash = password_hash($password, PASSWORD_BCRYPT);

echo $hash;
?>