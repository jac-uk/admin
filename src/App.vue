<template>
  <div class="govuk-width-container">
    <div class="govuk-main-wrapper">
      <header class="header">
        <        ECTION -->
        <        ovuk-grid-row">
        ovuk-grid-column-two-thirds organisation__margin-bottom">
        em-c-organisation-logo brand--ministry-of-justice">
        /jac-logo.svg"
        Appointments Commission"
        lign: center"
        ovuk-grid-column-one-third organisation__margin-bottom">
        ion"
        translation-nav gem-c-translation-nav gem-c-translation-nav--no-margin-top brand--ministry-of-justice"
        ranslations"
        m-c-translation-nav__list">
        m-c-translation-nav__list-item">
        n">English</span>
        m-c-translation-nav__list-item">
                                                      
        e"
        translation-nav__link brand__color"
        /www.judicialappointments.gov.uk/cymraeg"
        a>
        p-c-topic-list app-c-topic-list--small brand--ministry-of-justice ">
        p-c-topic-list__item">
        link app-c-topic-list__link app-c-topic-list__link--no-underline brand__color"
        /www.judicialappointments.gov.uk/business-plan" target="_bla
        k"
        ly</a>
        p-c-topic-list__item">
        link app-c-topic-list__link app-c-topic-list__link--no-underline brand__color"
        /www.judicialappointments.gov.uk/jac-official-statistics" target="_bla
        k"
        lify</a>
        p-c-topic-list__item">
        link app-c-topic-list__link app-c-topic-list__link--no-underline brand__color"
        /apply.judicialappointments.digital/vacancies" target="_bla
        k"
        ancies</a>
        p-c-topic-list__item">
        name !== 'sign-in'"
        button govuk-!-margin-bottom-0"
        ut"
        dIn"
        topic-list__item"
        w signed in as {{ userName }}</b>
        <              <        ECTION -->
        </heade r>
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-full">
            <d
              k-phase-banner"
            >
              ovuk-phase-banner__content">
              trong class="govuk-tag govuk-phase-banner__content__tag">
              </strong>
              <span
                class="govuk-phase-banner__tex                  This                     r feedback will help us impr                    </span>
            </p>
          </di                      </div>
                       "
                main-conten
              />
              </main>
            </d>
          </div>
          </t mp from 
          ort defa ',
          computed: {
          isSignedIn() {
          return this.$store.getters[' },
          userName() {
 
          return this.$store.state.auth.currentUser.displayName ? this.$store.state.auth.currentUser.displayName : this.$store.state.auth.currentUser },
          methods: {
          signOut() {
          auth().signOut();
          this.$router.go('/sign-in');
          },
          },
          };
          scss">
          // @import 'https://assets.publishing.service.gov.uk/static/govuk-template-c0b8ba8b1652aacad298d74f24752260187f538b5                      css';
          @import 'h
          tps://assets.publishing.service.gov.uk/static/fonts-e9ec5a5f82e5c2a17927ce356e5a054cb28025ec1547ec5d00f5c98d2ec5e481.css';
          @import 'https://assets.publishing.service.go                  -layou                ae550061                32da77312cf8ef2ab616c0.css';
          @import 'https://assets.publishing.service.gov.uk/col                  f0ad5c09cfd287444f877560d89793e621ff                    //                       scss styles
          .header {
          background-color: #fafafa;
          padding: 1.25em 0.625em 0 0.625em                          padding-top: 0px;
          }
          </style>
        </div>
      </header>
    </div>
  </div>
</template>
