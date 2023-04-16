import { createContext } from 'react';
import { RequestStatus } from '@/constants';
import { MusicWithIndex, QueueMusic, Musicbill } from './constants';

interface Context {
  getMusicbillListStatus: RequestStatus;
  musicbillList: Musicbill[];

  audioLoading: boolean;
  audioPaused: boolean;
  audioDuration: number;

  playlist: MusicWithIndex[];

  playqueue: QueueMusic[];
  currentPlayqueuePosition: number;

  lyricPanelOpen: boolean;
}

const context = createContext<Context>({
  getMusicbillListStatus: RequestStatus.LOADING,
  musicbillList: [],

  audioLoading: false,
  audioPaused: true,
  audioDuration: 0,

  playlist: [],

  playqueue: [],
  currentPlayqueuePosition: -1,

  lyricPanelOpen: false,
});

export default context;
