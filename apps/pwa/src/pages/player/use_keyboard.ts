import useNavigate from '@/utils/use_navigate';
import { PLAYER_PATH, ROOT_PATH } from '@/constants/route';
import { useEffect } from 'react';
import dialog from '@/utils/dialog';
import e, { EventType } from './eventemitter';
import { QueueMusic } from './constants';

export default ({
  paused,
  queueMusic,
}: {
  paused: boolean;
  queueMusic?: QueueMusic;
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'f': {
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault();
            navigate({
              path: `${ROOT_PATH.PLAYER}${PLAYER_PATH.SEARCH}`,
            });
            e.emit(EventType.FOCUS_SEARCH_INPUT, null);
          }
          break;
        }

        case 'l': {
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault();
            e.emit(EventType.OPEN_PLAYLIST_PLAYQUEUE_DRAWER, null);
          }
          break;
        }

        case 'w': {
          if (!paused && queueMusic && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            const id = dialog.alert({
              content: '正在播放中, 请先暂停音乐后再使用快捷键关闭知了',
              confirmText: '知道了',
            });
            window.setTimeout(() => dialog.close(id), 15000);
          }
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate, paused, queueMusic]);
};
