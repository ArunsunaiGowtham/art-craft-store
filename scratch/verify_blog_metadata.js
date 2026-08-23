const assert = require("assert");

global.window = global;
require("../js/data.js");

const { blogPosts, blogAuthors } = global.AppData;
const required = ["id", "title", "slug", "excerpt", "content", "image", "category", "date", "readTime", "authorId", "author"];
const ids = new Set();

blogPosts.forEach((post) => {
  required.forEach((field) => assert(post[field], `Article ${post.id} is missing ${field}`));
  assert(!ids.has(post.id), `Duplicate article ID ${post.id}`);
  ids.add(post.id);

  const profile = blogAuthors[post.authorId];
  assert(profile, `Article ${post.id} has an unknown author ID`);
  assert.strictEqual(post.author, profile, `Article ${post.id} does not use its canonical author profile`);
  assert.strictEqual(post.author.id, post.authorId, `Article ${post.id} has a mismatched author ID`);
  assert(profile.name && profile.avatar, `Author profile ${post.authorId} is incomplete`);
  assert(Array.isArray(post.categories) && post.categories.includes(post.category), `Article ${post.id} has an invalid category mapping`);
});

console.log(`Verified ${blogPosts.length} complete article records and ${Object.keys(blogAuthors).length} author profiles.`);
