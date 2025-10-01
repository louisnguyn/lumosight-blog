-- Insert a comprehensive greeting post that showcases all platform features
-- Run this in your Supabase SQL Editor

-- First, let's get a user ID (you'll need to replace this with an actual user ID from your auth.users table)
-- You can find a user ID by running: SELECT id FROM auth.users LIMIT 1;

-- Insert the greeting post
INSERT INTO posts (
  title,
  description,
  content,
  categories,
  tags,
  author_id,
  views,
  likes,
  active,
  image,
  created_at,
  updated_at
) VALUES (
  'Welcome to TanLoc Blog - Your Ultimate Blogging Platform! 🎉',
  'Discover all the amazing features of our blog platform in this comprehensive greeting post. Learn about rich content creation, user profiles, community features, and much more!',
  '<h1>Welcome to TanLoc Blog - Your Ultimate Blogging Platform! 🎉</h1>

<h2>Discover All Our Amazing Features</h2>

<p>Welcome to our vibrant community! This greeting post will walk you through all the incredible features that make our platform special.</p>

<h3>🎨 <strong>Rich Content Creation</strong></h3>
<p>Our platform supports rich text editing with:</p>
<ul>
<li><strong>Bold</strong> and <em>italic</em> text formatting</li>
<li>Bullet points and numbered lists</li>
<li>Code blocks and inline <code>code</code></li>
<li>Links and embedded content</li>
<li>Beautiful typography and spacing</li>
</ul>

<h3>📱 <strong>Responsive Design</strong></h3>
<p>Experience our platform on any device:</p>
<ul>
<li><strong>Mobile-first</strong> design that looks perfect on phones</li>
<li><strong>Tablet-optimized</strong> layouts for medium screens</li>
<li><strong>Desktop-enhanced</strong> features for large displays</li>
<li><strong>Dark mode</strong> support for comfortable reading</li>
</ul>

<h3>👥 <strong>User Profiles & Social Features</strong></h3>
<p>Connect with our amazing community:</p>
<ul>
<li><strong>Personal profiles</strong> with bio, avatar, and contact info</li>
<li><strong>Author pages</strong> showcasing all user posts</li>
<li><strong>Like system</strong> to show appreciation for great content</li>
<li><strong>Comments</strong> for engaging discussions</li>
<li><strong>View tracking</strong> to see post popularity</li>
</ul>

<h3>🏷️ <strong>Organization & Discovery</strong></h3>
<p>Find content that interests you:</p>
<ul>
<li><strong>Categories</strong> to organize posts by topic</li>
<li><strong>Tags</strong> for detailed content classification</li>
<li><strong>Search functionality</strong> to find specific content</li>
<li><strong>Sidebar filters</strong> for easy browsing</li>
<li><strong>Recent posts</strong> and trending content</li>
</ul>

<h3>🔐 <strong>Security & Privacy</strong></h3>
<p>Your data is safe with us:</p>
<ul>
<li><strong>Row Level Security (RLS)</strong> for data protection</li>
<li><strong>User authentication</strong> with secure login</li>
<li><strong>Profile management</strong> with privacy controls</li>
<li><strong>Secure data storage</strong> and transmission</li>
</ul>

<h3>🎯 <strong>Content Management</strong></h3>
<p>Full control over your content:</p>
<ul>
<li><strong>Draft system</strong> to save work in progress</li>
<li><strong>Publish/unpublish</strong> controls</li>
<li><strong>Edit capabilities</strong> for all your posts</li>
<li><strong>Image uploads</strong> with automatic optimization</li>
<li><strong>SEO-friendly</strong> URLs and metadata</li>
</ul>

<h3>📊 <strong>Analytics & Insights</strong></h3>
<p>Track your content performance:</p>
<ul>
<li><strong>View counts</strong> for each post</li>
<li><strong>Like statistics</strong> to see engagement</li>
<li><strong>Author rankings</strong> based on activity</li>
<li><strong>Popular content</strong> identification</li>
</ul>

<h3>🌟 <strong>Modern UI/UX</strong></h3>
<p>Enjoy a beautiful, intuitive interface:</p>
<ul>
<li><strong>Gradient backgrounds</strong> and modern styling</li>
<li><strong>Smooth animations</strong> and transitions</li>
<li><strong>Hover effects</strong> and interactive elements</li>
<li><strong>Loading states</strong> for better user experience</li>
<li><strong>Error handling</strong> with helpful messages</li>
</ul>

<h3>🚀 <strong>Performance Optimized</strong></h3>
<p>Lightning-fast experience:</p>
<ul>
<li><strong>Optimized images</strong> for quick loading</li>
<li><strong>Efficient database queries</strong> for speed</li>
<li><strong>Caching strategies</strong> for better performance</li>
<li><strong>Mobile optimization</strong> for fast browsing</li>
</ul>

<h3>💬 <strong>Community Features</strong></h3>
<p>Engage with fellow bloggers:</p>
<ul>
<li><strong>Comment system</strong> with replies</li>
<li><strong>User mentions</strong> and notifications</li>
<li><strong>Content sharing</strong> across platforms</li>
<li><strong>Social integration</strong> for wider reach</li>
</ul>

<h3>🎨 <strong>Customization Options</strong></h3>
<p>Make it your own:</p>
<ul>
<li><strong>Theme switching</strong> between light and dark modes</li>
<li><strong>Personal branding</strong> with custom avatars</li>
<li><strong>Content formatting</strong> with rich text editor</li>
<li><strong>Layout preferences</strong> for comfortable reading</li>
</ul>

<hr>

<h2>Get Started Today!</h2>

<p>Ready to join our amazing community? Here''s how to begin:</p>

<ol>
<li><strong>Create your account</strong> - Sign up for free</li>
<li><strong>Complete your profile</strong> - Add your bio and avatar</li>
<li><strong>Write your first post</strong> - Share your thoughts with the world</li>
<li><strong>Engage with others</strong> - Like, comment, and connect</li>
<li><strong>Explore features</strong> - Discover all our amazing tools</li>
</ol>

<h3>📝 <strong>Writing Tips</strong></h3>
<ul>
<li>Use clear, engaging headlines</li>
<li>Add relevant categories and tags</li>
<li>Include images to make posts more appealing</li>
<li>Engage with comments to build community</li>
<li>Share your unique perspective and voice</li>
</ul>

<h3>🤝 <strong>Community Guidelines</strong></h3>
<ul>
<li>Be respectful and kind to all members</li>
<li>Share original, valuable content</li>
<li>Give credit when using others'' work</li>
<li>Help others learn and grow</li>
<li>Report any inappropriate behavior</li>
</ul>

<hr>

<h2>Thank You for Joining Us!</h2>

<p>We''re thrilled to have you as part of our community. This platform was built with love and care to provide the best blogging experience possible. Whether you''re a seasoned writer or just starting out, we''re here to support your journey.</p>

<p><strong>Happy blogging!</strong> ✨</p>

<p><em>Feel free to explore all the features mentioned above, and don''t hesitate to reach out if you need any help getting started.</em></p>

<hr>

<p><strong>Categories:</strong> Platform Features, Getting Started, Community<br>
<strong>Tags:</strong> welcome, features, tutorial, community, blogging, platform, guide</p>

<p><em>This post demonstrates the rich text capabilities, formatting options, and community features available on our platform.</em></p>',
  'Platform Features',
  'welcome,features,tutorial,community,blogging,platform,guide,getting-started,rich-text,responsive,user-profiles,security,analytics,ui-ux,performance,community-features,customization',
  (SELECT id FROM auth.users LIMIT 1), -- This will use the first user in your auth.users table
  0, -- Initial views
  0, -- Initial likes
  true, -- Active (published)
  '/default-blog.jpg', -- Default image
  NOW(), -- Created at
  NOW() -- Updated at
);

-- Optional: Update the post with a better image URL if you have one
-- UPDATE posts SET image = 'https://your-image-url.com/greeting-post.jpg' WHERE title LIKE '%Welcome to TanLoc Blog%';

-- Verify the post was created
SELECT 
  id,
  title,
  categories,
  tags,
  author_id,
  active,
  created_at
FROM posts 
WHERE title LIKE '%Welcome to TanLoc Blog%';
