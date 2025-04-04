import fetchJson from "$lib/JavaScript/fetch-json"
import formatDate from "$lib/JavaScript/format-date";

const baseURL = 'https://fdnd-agency.directus.app/items/'

export default async function fetchReplies(commentIds) {
  if (!commentIds || commentIds.length === 0) return [];

  const repliesURL = `${baseURL}avl_comments?fields=time_posted,content,parent_id,likes,id,user_id.profile_picture.id,user_id.profile_picture.title,user_id.fullname,replies&filter[id][_in]=${commentIds.join(',')}`;
  const replies = await fetchJson(repliesURL);
  
  // Unlimited replies
  for (const reply of replies.data) {
    reply.replies = await fetchReplies(reply.replies); 
    reply.time_posted = formatDate(reply.time_posted);
  }

  return replies.data;
}