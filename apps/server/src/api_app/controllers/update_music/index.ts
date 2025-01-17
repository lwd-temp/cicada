import { ExceptionCode } from '#/constants/exception';
import { AllowUpdateKey } from '#/constants/music';
import { getMusicById, Property as MusicProperty } from '@/db/music';
import { Context } from '../../constants';
import { Music, Parameter } from './constants';
import updateCover from './update_cover';
import updateName from './update_name';
import updateLyric from './update_lyric';
import updateAliases from './update_aliases';
import updateSq from './update_sq';
import updateHq from './update_hq';
import updateAc from './update_ac';
import updateSinger from './update_singer';
import updateForkFrom from './update_fork_from';

const KEY_MAP_HANDLER: Record<AllowUpdateKey, (p: Parameter) => Promise<void>> =
  {
    [AllowUpdateKey.COVER]: updateCover,
    [AllowUpdateKey.NAME]: updateName,
    [AllowUpdateKey.LYRIC]: updateLyric,
    [AllowUpdateKey.ALIASES]: updateAliases,
    [AllowUpdateKey.SQ]: updateSq,
    [AllowUpdateKey.HQ]: updateHq,
    [AllowUpdateKey.AC]: updateAc,
    [AllowUpdateKey.SINGER]: updateSinger,
    [AllowUpdateKey.FORK_FROM]: updateForkFrom,
  };

export default async (ctx: Context) => {
  const { id, key, value } = ctx.request.body as {
    id?: unknown;
    key?: unknown;
    value?: unknown;
  };

  if (
    typeof id !== 'string' ||
    !id.length ||
    // @ts-expect-error
    !Object.values(AllowUpdateKey).includes(key)
  ) {
    return ctx.except(ExceptionCode.PARAMETER_ERROR);
  }

  const music: Music | null = await getMusicById(id, [
    MusicProperty.ID,
    MusicProperty.COVER,
    MusicProperty.NAME,
    MusicProperty.CREATE_USER_ID,
    MusicProperty.ALIASES,
    MusicProperty.TYPE,
    MusicProperty.SQ,
    MusicProperty.HQ,
    MusicProperty.AC,
  ]);
  if (!music || (!ctx.user.admin && music.createUserId !== ctx.user.id)) {
    return ctx.except(ExceptionCode.MUSIC_NOT_EXIST);
  }

  await KEY_MAP_HANDLER[key as AllowUpdateKey]({ ctx, music, value });
};
