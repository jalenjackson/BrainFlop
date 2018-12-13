import React from 'react';

export default class BlogComponent extends React.Component {
  componentDidMount() {
    fetch(`https://api.quizop.com/tags?limit=9&skipAmount=0`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ tags: body.tags });
        setTimeout(() => {
          this.setState({ tagsRendered: true })
        }, 200)
      });
    }).catch((err) => {
      console.log(err)
    })
  }

  render() {
    return (
      <div className='blog'>
        <p><br /></p>
        <p>7 ways to stay motivated and make millions</p>
        <p>Does it seem like there is never enough time in one day for yourself? It can be very difficult to stay motivated on your personal projects when you have work from 9-5, you don&rsquo;t get home until 6, your children destroyed the entire house so your
          cleaning from 6-7, there isn&rsquo;t any food in the fridge so you cook from 7-8. By then you&#39;re too exhausted to even think about your personal project so you relax watch tv, and eventually go to sleep to wake up and do it all over again.&nbsp;</p>
        <p><br /></p>
        <p>If this is you, that is okay. That is most people. The daily responsibilities in life can be very time-consuming. &nbsp;So how do you stay motivated so you can accomplish your goals and start making millions? Here is a list of 10 things that are crucial
          to staying motivated and making millions.</p>
        <p><br /></p>
        <p>1. &nbsp; &nbsp;You need to think of a goal. Visualize that goal in your head, and think about how happy you will be when you accomplish it. Think about yourself waking up in the morning in a multi-million dollar house, looking outside to see two million
          dollar cars outside. It doesn&rsquo;t have to be realistic, but when you set your high you achieve below that will be a huge step up. Use your five senses when setting a goal. Visualize it, Smell it, hear it, taste it, and touch it. In the artcile
          Taste, See, and Feel Success: Using Our Five Senses to Accomplish Goals, Dr. Krista Wells states &quot;By thinking about our senses of sight, hearing, taste, smell, and touch, we can take a holistic approach to goal setting&quot;. For more information
          about using your five senses to goal setting visit &nbsp;https://www.nationalmilitaryspousenetwork.org/public/Taste-See-Feel-Success-Using-Our-Five-Senses-Accomplish-Goals-Dr-Krista-Wells.cfm. &nbsp;When you do that you will find time to take an hour
          or two towards getting closer and closer to your goal. The human mind is extraordinary and when you put in the time each day you will accomplish huge goals https://www.youtube.com/watch?v=5MgBikgcWnY</p>
        <p><br /></p>
        <p>2. &nbsp; &nbsp;Think about why you want to accomplish this goal. Is it money? Is it family? What are the reasons why you&rsquo;re doing all of this in the first place! When you set a list of reasons why you start to prioritize your life. Make your goals
          a top priority, put in the extra time. You only get out what you put into it. When you work on your goals part time you will get part-time results. But life is very demanding and part-time is better than no time. Consistent part-time will eventually
          turn into something you would have never imagined.</p>
        <p><br /></p>
        <p>3. &nbsp; &nbsp;Don&rsquo;t try to take on the goal all at once. Break it down. Make a goal with a bunch of sub-goals. Try to accomplish each goal one at a time so that it eventually leads you towards accomplishing the entire goal. This will help in your
          overall happiness and productivity. PHD pyschologist Welton Chang said Each small step, taken on its own, seems doable, while trying to summit the peak can seem incredibly daunting. If you start splitting up larger tasks into smaller tasks you won&#39;t
          feel overwhelmed and you will feel like you are getting closer and closer to your goal. When you try to accomplish something that is too large of a goal it&rsquo;s a lot easier to give up because of its too much work. When you put it into parts each
          small success triggers that dopamine rush in your system causing you to want to accomplish the next goal even more.</p>
        <p><br /></p>
        <p>4. &nbsp; &nbsp;Design a strategy towards accomplishing your goal. Plan out each step it will take to accomplish your goal. Its okay if you don&rsquo;t follow each step perfectly. It&#39;s natural for a strategy to take a different route.&nbsp;</p>
        <p><br /></p>
        <p>5. &nbsp; &nbsp;Determine how you will deal with re-routing. If something does not pan out in one of your sub-goals think of a plan b for that goal. By any mean do not give up! Think of a way to reroute and come up with a plan much better than the previous
          plan.</p>
        <p><br /></p>
        <p>6. &nbsp; &nbsp;Ask for help. You may be able to accomplish your goals alone, but if someone is helping you it can make life a whole lot easier. You have someone to bounce ideas off of and keep the daily motivation. When you feeling down that day he or
          she can help to light a spark back into you and vice versa. Working with someone else drives more creativity and productivity.</p>
        <p><br /></p>
        <p>7. &nbsp; &nbsp;Have fun! When your having fun it doesn&rsquo;t even feel like your working. Think of creative ways to make your work fun, and you will be much happier and more productive. You will find yourself spending much more time and accomplishing
          much more when you genuinely having fun,. Because it doesn&rsquo;t feel like work so you never feel overwhelmed. Wake up in the morning and get excited about how much you are going to get done today. And how much closer you are to accomplishing your
          goals.&nbsp;</p>
        <p><br /></p>
        <p>If you follow these 7 steps you are on your way to greatness. Making millions is not as hard as people think it is. It really is all a mindset. Chanel your mind and accomplish your goals. Good Luck! Does anything else keep you motivated? We would love
          to know about it! Social media links</p>
        <p><br /></p>
      </div>
    )
  }
}
