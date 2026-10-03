export const storyHeadings = [
  'The Day Our Paths Crossed',
  'Then Came Us',
  'Through It All',
  'And Then There Was Forever',
] as const;

export const suppliedLoveStory = `The Day Our Paths Crossed

23rd December,2023

Every love story has a beginning, and ours began on the 23rd of December,2023.

Neither of us knew that an ordinary meeting would become the beginning of something so beautiful. We simply crossed paths all thanks to our mutual friend Onos and somehow, that moment became the first page of our story.

Then Came Us

What followed was a beautiful mix of friendship, laughter, love, unforgettable moments and lessons that shaped us into the couple we are today.

Along the way, I discovered a man with a genuinely kind heart and a sweet soul. A man who cares deeply and loves in his own way.

And yes… a truly “finished man”.

Blessing, one of the things I cherish most about you is the way you care for me. It is in the little things, the thoughtful moments, the times you show up and the way you make me feel loved.

I may not always say it enough, but I see you.

I see your heart.
I see your kindness.
I see the man you are becoming.
And I am so proud to love you.

Through It All

Our story hasn’t been perfect and we never expected it to be.

We have had moments that tested us, moments that made us laugh until our stomachs hurt, moments that taught us patience, forgiveness and the importance of choosing each other.

And through it all, we kept finding our way back to each other.

Because sometimes love isn’t about having a perfect story.

It’s about finding the person you want to write the rest of the story with.

And Then There Was Forever

Today, we stand at the beginning of our next chapter not just as two people in love, but as two people ready to build a life together.

When I look back at that 23rd of December, I am filled with gratitude.

Grateful that our paths crossed.
Grateful for everything we’ve shared.
Grateful for everything we’ve overcome.
And most of all, grateful that somehow, out of all the people in this world, I found you.

Blessing, I choose you.

I choose you for today, for tomorrow, and for every tomorrow that God gives us.

And if I could go back to that day and meet you all over again, I would still choose you.

From 23rd December to Forever.`;

export const storyImages = [
  {src:'/couple/together.webp',alt:'Blessing and Blessing taking a photograph together at an event',width:810,height:1440},
  {src:'/couple/laughter.webp',alt:'Blessing and Blessing sitting together at a restaurant',width:960,height:1280},
  {src:'/couple/together.webp',alt:'Blessing and Blessing together, both wearing sunglasses',width:810,height:1440},
  {src:'/couple/forever.webp',alt:'Blessing kissing Blessing on the cheek',width:960,height:1378},
] as const;

export type StoryChapter = {title:string;paragraphs:string[]};
export function splitLoveStory(story:string):StoryChapter[]{
  const chapters:StoryChapter[]=[];
  for(const block of story.trim().split(/\n\s*\n/)){
    const heading=block.trim();
    if(storyHeadings.some(title=>title===heading))chapters.push({title:heading,paragraphs:[]});
    else{
      if(!chapters.length)chapters.push({title:'',paragraphs:[]});
      chapters[chapters.length-1].paragraphs.push(block.trim());
    }
  }
  return chapters;
}
