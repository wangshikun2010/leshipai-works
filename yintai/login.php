<?php
$info_ok = array(
	'status' 	=> 	200,
	'msg'		=>	'操作成功',
	'userId'    =>	'0099'
);

$error = array(
	'status'	=> 	404,
	'msg'		=>	'操作失败'
);

if (true) {
	echo json_encode($info_ok);
} else {
	echo json_encode($error);
}
?>