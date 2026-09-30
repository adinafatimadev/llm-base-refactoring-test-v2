import { desc, eq, inArray, sql } from "drizzle-orm";
import { db, schema } from "../db";
const { posts, users, follows } = schema;
interface FeedOptions {
	limit?: number;
	offset?: number;
	userId?: string;
}
function selectPosts(ids: string[] | undefined, o: FeedOptions) {
	const liked = o.userId
		? sql<number>`EXISTS(SELECT 1 FROM likes l WHERE l.post_id=${posts.id} AND l.user_id=${o.userId})`
		: sql<number>`0`;
	return db
		.select({
			id: posts.id,
			content: posts.content,
			createdAt: posts.createdAt,
			updatedAt: posts.updatedAt,
			author: {
				id: users.id,
				username: users.username,
				displayName: users.displayName,
				avatarUrl: users.avatarUrl,
			},
			likeCount: sql<number>`(SELECT count(*) FROM likes l2 WHERE l2.post_id=${posts.id})`,
			commentCount: sql<number>`(SELECT count(*) FROM comments c WHERE c.post_id=${posts.id})`,
			isLiked: liked,
		})
		.from(posts)
		.leftJoin(users, eq(posts.authorId, users.id))
		.where(ids ? inArray(posts.authorId, ids) : undefined)
		.orderBy(desc(posts.createdAt))
		.limit(o.limit || 20)
		.offset(o.offset || 0);
}
export async function getHomeFeed(userId: string, o: FeedOptions = {}) {
	const following = await db
		.select({ followingId: follows.followingId })
		.from(follows)
		.where(eq(follows.followerId, userId));
	const ids = [...following.map((x) => x.followingId), userId];
	if (!ids.length) return [];
	return (await selectPosts(ids, { ...o, userId })).map((x) => ({
		...x,
		isLiked: Boolean(x.isLiked),
	}));
}
export async function getExploreFeed(o: FeedOptions = {}) {
	return (await selectPosts(undefined, o)).map((x) => ({ ...x, isLiked: Boolean(x.isLiked) }));
}
