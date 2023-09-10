import {createBullBoard} from '@bull-board/api';
import {BullAdapter} from '@bull-board/api/bullAdapter';
import {ExpressAdapter} from '@bull-board/express';
import { findRoom } from './findRoom';



const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const BullBoard = createBullBoard({ 
    queues: [
        new BullAdapter(findRoom),
    ],
    serverAdapter: serverAdapter
});

export default serverAdapter;