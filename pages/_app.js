import React from 'react'
import App, {Container} from 'next/app'
import PageNotFound from '../src/components/notFound';
import NProgress from 'nprogress'
import 'core-js/fn/object/assign';
import '../src/sass/global.sass';
import '../src/sass/sharedQuizGame.sass';
import '../src/components/Category/category.sass';
import '../src/components/Explore/explore.sass'
import '../src/components/PersonalityQuizGame/personalityQuizGame.sass';
import '../src/components/Profile/profile.sass';
import '../src/components/CreateAQuiz/createAQuiz.sass';
import '../src/components/CustomizeExperience/customizeExperience.sass';
import '../src/components/EditQuiz/editQuiz.sass';
import '../src/components/Quiz/quiz.sass';
import '../src/sass/content-loader.sass';
import '../src/components/Login/login.sass';
import '../src/components/Register/register.sass';
import '../src/sass/resetPassword.sass';
import '../src/components/TermsAndConditions/terms.sass';
import '../src/sass/notFound.sass';
import '../src/components/Blog/blog.sass';
import '../src/components/PrivacyPolicy/privacyPolicy.sass';
import Router from 'next/router';

const linkStyle = {
  margin: '0 10px 0 0'
};

Router.events.on('routeChangeStart', (url) => {
  NProgress.start()
});
Router.events.on('routeChangeComplete', () => {
  NProgress.done()
});
Router.events.on('routeChangeError', () => NProgress.done())

export default class MyApp extends App {
  static async getInitialProps ({ Component, router, ctx }) {

    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    if (pageProps.hasOwnProperty('statusCode') && (pageProps.statusCode === 404 || pageProps.statusCode === 500)) {
      ctx.res.redirect('/');
      ctx.res.end();
      return {}
    }

    return {pageProps}
  }

  componentDidMount() {
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2&appId=328619197927561&autoLogAppEvents=1';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  componentDidUpdate() {
    window.FB.XFBML.parse();
  }

  render () {
    const {Component, pageProps} = this.props;

    return (
      <Container>
        <div id="fb-root"></div>
        <Component {...pageProps} />
      </Container>
    )
  }
}
