import { Context } from '@/constants/koa';
import { DefaultState } from 'koa';
import Router from 'koa-router';
import getMusicCover from './controllers/get_music_cover';

const router = new Router<DefaultState, Context>();
router.get('/music_cover/:asset', getMusicCover);

export default router;