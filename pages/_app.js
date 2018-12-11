import React from 'react'
import App, {Container} from 'next/app'
import NProgress from 'nprogress'
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
import '../src/components/TermsAndConditions/terms.sass';
import '../src/components/PrivacyPolicy/privacyPolicy.sass';
import Router from 'next/router';

const linkStyle = {
  margin: '0 10px 0 0'
};

Router.events.on('routeChangeStart', (url) => {
  NProgress.start()
});
Router.events.on('routeChangeComplete', () => {
  setTimeout(() => {
    NProgress.done()
  }, 300)
});
Router.events.on('routeChangeError', () => NProgress.done())

export default class MyApp extends App {
  static async getInitialProps ({ Component, router, ctx }) {

    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return {pageProps}
  }

  render () {
    const {Component, pageProps} = this.props
    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    )
  }
}