import Bull from 'bull';
import { config } from '../../utils/config';
import { proccser,onCompleted,onError } from '../process/findRoom.process';
const findRoom = new Bull('findRoom', {
	redis: config.redis,
});
findRoom.process(proccser);
findRoom.on('completed', onCompleted);
findRoom.on('error', onError);  

let addToFindRoomQueue = async (data: any) => {
     findRoom.add(data);
}
export {addToFindRoomQueue, findRoom}
