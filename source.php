<?php
$input = $_GET['input'];
if (!$input) { die(); }

$words = explode(' ','lorem ipsum dolor sit amet consectetur adipiscing elit curabitur et nunc orci eget lacinia augue mauris ac urna aliquam risus orci convallis nec laoreet nec commodo et neque phasellus eu dapibus velit cras a dignissim nisi curabitur aliquet tellus id erat facilisis a consequat elit dapibus nam in dui');
$result = array();

foreach ($words as $w)
{
	if (strpos($w,$input) !== false)
	{
		$c = str_replace($input,'<b>'.$input.'</b>',$w);
		echo '<li data-value="'.$w.'">'.$c.'</li>'."\n";
	}
}

