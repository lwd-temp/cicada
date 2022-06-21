import { request } from '.';

function getSelfMusicbill(id: string) {
  return request<{
    id: string;
    cover: string;
    name: string;
    public: 0 | 1;
    createTimestamp: number;
    musicList: {
      id: string;
      type: 1 | 2;
      name: string;
      aliases: string;
      cover: string;
      sq: string;
      hq: string;
      ac: string;
      singers: {
        id: string;
        name: string;
        aliases: string;
        avatar: string;
      }[];
    }[];
  }>({
    path: '/api/self_musicbill',
    params: { id },
    withToken: true,
  });
}

export default getSelfMusicbill;