import { weddingConfig } from './wedding-config';

export const storyIntro = 'From a random encounter at the bank to forever.';

export const suppliedLoveStory = `Funny how life has a way of bringing two people together when they least expect it.

Our love story began quite randomly on the 23rd of December, 2023. I had gone to the bank to resolve an issue completely unaware that the day would become the beginning of something so beautiful. In the middle of it all, my friend Onos called me outside to meet him.

When I stepped out, I saw this tall, dark, handsome fellow standing beside him. I greeted my friend with a hug, exchanged pleasantries and then, to my utmost surprise, this stranger attempted to hug me too. My immediate reaction? “Hol’ up! I don’t hug strangers!” 😂

Little did I know that the stranger I was so quick to keep at arm’s length would one day become my husband-to-be.

Apparently, he was interested enough to ask Onos for my phone number. But Onos, being the good friend he is, asked for my permission first. And guess what? I said no! 😂 I wasn't about to hand my number over to just anybody.

It took a few weeks before I finally agreed to share my number with him. Fast-forward to January, he reached out, we started talking, and somehow, what began as a random meeting slowly blossomed into something special. We kept talking, got to know each other, and before we knew it, we were writing our own love story.

And as they say, “the rest is history.”

Today, that same tall, dark fellow who couldn't even get a hug from me on our first meeting is the man I get to call my fiancé. The man I am preparing to spend the rest of my life with. The man I will walk down the aisle to meet this December.

Isn't it beautiful how God can take an ordinary day, an unexpected introduction, and two people who had no idea what was coming, and turn it into a lifetime of love?

From “I don't hug strangers” to “I do.” 😂

Our story is a beautiful reminder that sometimes, the things we never planned turn out to be the most beautiful parts of our lives.

And now, we are counting down to forever.

Here's to us, to love, to friendship, to God's beautiful timing, and to forever with my once-upon-a-stranger.`;

export const entrancePhoto = weddingConfig.gallery[0].src;
export const storyImages = [weddingConfig.gallery[1], weddingConfig.gallery[2], weddingConfig.gallery[3]] as const;

export type StoryChapter = {title:string;paragraphs:string[]};
export function splitLoveStory(story:string):StoryChapter[]{
  const paragraphs = story.trim().split(/\n\s*\n/).map(block => block.trim());
  // Chapter markers are existing paragraphs: the supplied story stays intact.
  const beginnings = [
    {start: paragraphs[0], title: 'An ordinary day at the bank'},
    {start: 'Apparently, he was interested enough', title: 'Then we started talking'},
    {start: 'Today, that same tall, dark fellow', title: 'From strangers to “I do”'},
    {start: 'And now, we are counting down', title: 'Counting down to forever'},
  ];
  const chapters:StoryChapter[]=[];
  for(const paragraph of paragraphs){
    const beginning = beginnings.find(({start}) => paragraph.startsWith(start));
    if(beginning) chapters.push({title:beginning.title,paragraphs:[]});
    if(!chapters.length) chapters.push({title:'Our story',paragraphs:[]});
    chapters[chapters.length-1].paragraphs.push(paragraph);
  }
  return chapters;
}
