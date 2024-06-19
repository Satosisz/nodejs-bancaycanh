import * as _ from 'lodash'
export const newArrayError = (arr: any, message: string) => {
		if(!_.isEmpty(arr)) {
			return arr.push(message);
		}
		return [message];
}

export function getSecond() {
	let currentTime = new Date();
	return Math.floor(currentTime.getTime() / 1000);
}

export const makeId = (length) => {
	let result = '';
	let characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let charactersLength = characters.length;
	for ( let i = 0; i < length; i++ )
	{
		result += characters.charAt( Math.floor( Math.random() * charactersLength ) );
	}
	return result;
}

export function pare_url_file(image, folder = '')
{
	if (!image) {
		return 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTzMcYWJkLEXnPD7zTbRwdnNRjjNPJDdP4ePQ&usqp=CAU';
	}
	var explode = image.split("__");
	return process.env.BACKEND_APP_URL + "/api/upload/" + image
}