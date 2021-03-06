import React from 'react';
import { connect, Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import ReactTabs from 'react-tabs';

// For Walkthrough 
import Joyride from 'react-joyride';
import '../css/react-joyride-compiled.css';

import 'bootstrap-css';
import 'bootstrap';

import configureStore from './configureStore';
import * as Action from './actions';
import WebSocket from './WebSocket';
import MessageHandler from './MessageHandler';
import { ProjectSelector, AddProject, ProjectTab } from './Projects';
import DatasetsTab from './Datasets';
import FeaturesTab from './Features';
import ModelsTab from './Models';
import PredictTab from './Predictions';
import { Notifications } from './Notifications';
import colorScheme from './colorscheme';
import Progress from './Progress';
import CesiumTooltip from './Tooltip';

const Tab = ReactTabs.Tab;
const Tabs = ReactTabs.Tabs;
const TabList = ReactTabs.TabList;
const TabPanel = ReactTabs.TabPanel;
const cs = colorScheme;

const store = configureStore();

const messageHandler = (new MessageHandler(store.dispatch)).handle;

class MainContent extends React.Component {

  // For Walkthrough
  constructor(props) {

    super(props);

    this.state = {
      autoStart: false,
      running: false,
      steps: [
        {
          text: 'Firstly, create your project!',
          selector: '#react-tabs-0',
          position: 'right',
        },
        {
          text: 'Click here expand project info tab!',
          selector: '.newProjectExpand',
          position: 'right',
        },
         {
          text: 'Given your project information',
          selector: '.newProjectExpand > div > div',
          position: 'right',
        },

        {
          text: 'Enter a name for your project',
          selector: 'div.newProjectExpand > div > div > div > div > form > div:nth-child(1) > input',
          position: 'right',
        },
         {
          text: 'Enter a description for your project',
          selector: 'div.newProjectExpand > div > div > div > div > form > div:nth-child(2) > input',
          position: 'right',
        },
         {
          text: 'Click here',
          selector: 'div.newProjectExpand > div > div > div > div > form > div:nth-child(3) > button',
          position: 'right',
        },
         {
          text: 'Add Data!',
          selector: '#react-tabs-2',
          position: 'right',
        },
        {
          text: 'Add Features!',
          selector: '#react-tabs-4',
          position: 'right',
        },
      ],
      step: 0,
    };
  
    this.handleClickStart = this.handleClickStart.bind(this);
    this.handleJoyrideCallback = this.handleJoyrideCallback.bind(this);
  }

  componentDidMount() {
    store.dispatch(Action.hydrate());
  }

  handleClickStart(e) {
    e.preventDefault();

    this.setState({
      running: true,
      autoStart: true,
      step: 0,
    });
  }
 
  handleJoyrideCallback(result) {

    const { joyride } = this.props;
    
    if (result.type === 'step:before') {   
      this.setState({ step: result.index});
    }

    if (result.type === 'finished' && this.state.running) {
      // Need to set our running state to false, so we can restart if we click start again.
      this.setState({ running: false });
    }

    if (result.type === 'error:target_not_found') {
      this.setState({
        step: result.action === 'back' ? result.index - 1 : result.index + 1,
        autoStart: result.action !== 'close' && result.action !== 'esc',
      });
    }

    if (typeof joyride.callback === 'function') {
      joyride.callback();
    }
  }
  
  render() {
    const config = {
      sidebar: 300,
      topbar: '4em',
      footer: '4em'
    };

    const style = {
      main: {
        background: 'white',
        zIndex: 5,

        position: 'absolute',
        height: 'auto',
        top: config.topbar,
        right: 0,
        left: config.sidebar,
        width: 'auto',

        marginBottom: 0,
        marginRight: 'auto',

        selectors: {
          paddingLeft: '2em',
          marginBottom: '1em',
          borderLeft: '20px solid MediumVioletRed'
        }
      },
      topbar: {
        position: 'fixed',
        zIndex: 10,
        left: 0,
        background: cs.darkBlue,
        color: '#EFEFEF',
        height: config.topbar,
        lineHeight: config.topbar,
        top: 0,
        margin: 0,
        right: 0,
        borderRight: 'solid 2px #36454f',
        marginBottom: '1em',
        paddingLeft: '1em',
        paddingRight: '1em',
        paddingTop: 0,
        header: {
          float: 'right',
          fontWeight: 'bold',
          fontSize: '200%',
          lineHeight: '50px',
          verticalAlign: 'bottom'
        },
        subheader: {
          fontStyle: 'italic',
          fontSize: '100%',
          float: 'right'
        },
        text: {
          paddingTop: '0.5em'
        }
      },
      logo: {
        img: {
          height: 50,
          paddingTop: 10,
          paddingBottom: 10
        }
      },
      sidebar: {
        width: config.sidebar,
        zIndex: 10,
        background: cs.darkGray,
        color: '#eee',
        position: 'fixed',
        top: config.topbar,
        bottom: 0,
        left: '0em',
        height: 'auto',
      },
      sidebarContent: {
        paddingLeft: '1em'
      },
      footer: {
        position: 'fixed',
        zIndex: -1000,
        fontSize: '110%',
        bottom: 0,
        margin: 0,
        left: config.sidebar,
        right: 0,
        textAlign: 'center',
        verticalAlign: 'middle',
        color: 'white',
        lineHeight: config.footer,
        height: config.footer,
        background: cs.darkBlue,
        a: {
          color: 'white',
          textDecoration: 'underline'
        }
      },
      projectSelector: {
        zIndex: 1000,
        marginLeft: '1em',
        position: 'relative'
      },
      addProject: {
        a: { color: 'white' },
        paddingTop: '-2em',
        paddingBottom: '1em',
        dot: {
          background: cs.darkGray
        }
      },
      topic: {
        width: config.sidebar,
        position: 'relative',
        left: 0,
        background: cs.blue,
        color: '#EFEFEF',
        height: 60,
        lineHeight: '60px',
        verticalAlign: 'middle',
        top: 0,
        margin: 0,
        padding: 0,
        fontSize: '180%',
        marginBottom: '1em',
        paddingTop: 0,
        paddingRight: '1em',
        paddingLeft: '0.5em'
      },
      moveUp: {
        position: 'relative',
        top: '-2em',
        paddingTop: 0
      },
      tabs: {
        paddingTop: '1em',
        paddingLeft: '1em',
      },
      disableable: {
        pointerEvents: !this.props.selectedProject.id ? 'none' : 'auto',
        opacity: 1.0 - (0.5*(!this.props.selectedProject.id ? 1 : 0))
      },
      tabPanel: {
        background: 'white',
        height: 'auto',
        paddingLeft: '2em',
        paddingRight: '1em',
        paddingBottom: '1em'
      },
      progress: {
        height: '4em'
      },
    };
    const rotate = `rotate(${this.props.logoSpinAngle}deg)`;
    const rotateStyle = {
      WebkitTransition: 'all 1.0s ease-in-out',
      MozTransition: 'all 1.0s ease-in-out',
      OTransition: 'all 1.0s ease-in-out',
      transition: 'all 1.0s ease-in-out',
      WebkitTransform: rotate,
      MozTransform: rotate,
      msTransform: rotate,
      OTransform: rotate,
      transform: rotate
    };

    const { joyride } = this.props;
    const joyrideProps = {
      autoStart: joyride.autoStart || this.state.autoStart,
      callback: this.handleJoyrideCallback,
      locale: { close: 'Close', last: 'Last', next: 'Next', skip: 'Skip' },
      debug: true,
      disableOverlay: true,
      resizeDebounce: joyride.resizeDebounce,
      run: joyride.run || this.state.running,
      scrollToFirstStep: joyride.scrollToFirstStep || true,
      stepIndex: joyride.stepIndex || this.state.step,
      steps: joyride.steps || this.state.steps,
      type: joyride.type || joyride.index || 'continuous',
      allowClicksThruHole: true
    };

    return (
      <div>
        
      <Joyride
        {...joyrideProps}
        ref={c => (this.joyride = c)} />
          
        <div style={style.topbar}>
          <div style={style.topbar.text}>
            <div style={style.topbar.header}>
              Cesium &nbsp;
              <img
                src="images/cesium-blue-dark.png"
                alt="Cesium Logo"
                onClick={this.props.spinLogo}
                style={{ ...(style.logo.img), ...rotateStyle }}
              />
            </div>

          </div>
        </div>
       

        <div style={style.sidebar}>
          <div style={style.topic}>Project</div>

          <div style={style.sidebarContent}>
            <ProjectSelector label="Choose your project here:" style={style.projectSelector} />
            <AddProject id="newProjectExpander" label="Or click here to add a new one" style={style.addProject}/>
          </div>

          <div style={style.topic}>Progress</div>

          <div style={style.sidebarContent}>
            <div style={style.progress}>
              <Progress type="data" />
            </div>
            <div style={style.progress}>
              <Progress type="features" />
            </div>
            <div style={style.progress}>
              <Progress type="models" />
            </div>
            <div style={style.progress}>
              <Progress type="predict" />
            </div>
          </div>

        </div>

        <div className="mainContent" style={style.main}>

          <Notifications style={style.notifications} />

          <Tabs>
            <TabList style={style.tabs}>
              <Tab
                className="tab1"
                data-tip
                data-for="projectTabTooltip"
                style={style.disableable}
              >
                Projects
              </Tab>
              <Tab
                className="tab2"
                data-tip
                data-for="datasetsTabTooltip"
                style={style.disableable}
              >
                Data
              </Tab>
              <Tab
                data-tip
                data-for="featuresTabTooltip"
                style={style.disableable}
              >
                Features
              </Tab>
              <Tab
                data-tip
                data-for="modelsTabTooltip"
                style={style.disableable}
              >
                Models
              </Tab>
              <Tab
                data-tip
                data-for="predictTabTooltip"
                style={style.disableable}
              >
                Predict
              </Tab>
              <Tab
                data-tip
                data-for="statusTabTooltip"
              >
                <WebSocket
                  url={`ws://${this.props.root}websocket`}
                  auth_url={`${location.protocol}//${this.props.root}socket_auth_token`}
                  messageHandler={messageHandler}
                  dispatch={store.dispatch}
                />
              </Tab>
            </TabList>
            <TabPanel style={style.tabPanel}>
              <ProjectTab selectedProject={this.props.selectedProject} />
            </TabPanel>
            <TabPanel style={style.tabPanel}>
              <DatasetsTab selectedProject={this.props.selectedProject} />
            </TabPanel>
            <TabPanel style={style.tabPanel}>
              <FeaturesTab
                selectedProject={this.props.selectedProject}
                featurePlotURL={`${location.protocol}//${this.props.root}plot_features`}
              />
            </TabPanel>
            <TabPanel style={style.tabPanel}>
              <ModelsTab selectedProject={this.props.selectedProject} />
            </TabPanel>
            <TabPanel style={style.tabPanel}>
              <PredictTab selectedProject={this.props.selectedProject} />
            </TabPanel>
            <TabPanel style={style.tabPanel}>
              <h3>System Status</h3>
            </TabPanel>
          </Tabs>
          <div style={style.footer}>
            <div>
              <button onClick={this.handleClickStart}>Start a Tour!</button>
            </div>  
            Cesium is an open source Machine Learning Time-Series Platform
            &middot;
            Follow the <a style={style.footer.a} href="http://cesium-ml.org">Cesium project</a> on <a style={style.footer.a} href="https://github.com/cesium-ml">GitHub</a>
          </div>

        </div>

        <CesiumTooltip
          id="projectTabTooltip"
          text="Manage your projects"
          place="bottom"
        />
        <CesiumTooltip
          id="datasetsTabTooltip"
          text="Upload your time-series data"
          place="bottom"
        />
        <CesiumTooltip
          id="featuresTabTooltip"
          text="Generate features from your time-series data"
          place="bottom"
        />
        <CesiumTooltip
          id="modelsTabTooltip"
          text="Train a model from a feature set"
          place="bottom"
        />
        <CesiumTooltip
          id="predictTabTooltip"
          text="Generate predictions for new data"
          place="bottom"
        />
        <CesiumTooltip
          id="statusTabTooltip"
          text="Application status"
          place="bottom"
        />

      </div>
    );
  }
}

MainContent.propTypes = {
  selectedProject: React.PropTypes.object.isRequired,
  root: React.PropTypes.string.isRequired,
  logoSpinAngle: React.PropTypes.number.isRequired,
  spinLogo: React.PropTypes.func,
  toggleProjectExpander: React.PropTypes.func,

  // For Walkthrough
  joyride: React.PropTypes.shape({
    autoStart: React.PropTypes.bool,
    callback: React.PropTypes.func,
    run: React.PropTypes.bool,
  })
};

MainContent.defaultProps = {
  joyride: {
    autoStart: false,
    resizeDebounce: false,
    run: false,
  },
}

const mapStateToProps = function (state) {
  // This can be improved by using
  // http://redux-form.com/6.0.0-alpha.13/docs/api/FormValueSelector.md/
  const projectSelector = state.form.projectSelector;
  const selectedProjectId = projectSelector ? projectSelector.project.value : "";
  let selectedProject = state.projects.projectList.filter(
    p => (p.id == selectedProjectId)
  );

  const firstProject = state.projects.projectList[0] || { id: '', label: '', description: '' };

  if (selectedProject.length > 0) {
    selectedProject = selectedProject[0];
  } else {
    selectedProject = firstProject;
  }

  return {
    projects: state.projects.projectList,
    datasets: state.datasets,
    featuresets: state.featuresets,
    selectedProject,
    logoSpinAngle: state.misc.logoSpinAngle,
    projectExpanderIsOpen: state.expander.opened.newProjectExpander,
  };
};

const mapDispatchToProps = dispatch => (
  {
    handleSubmitModelClick: (form) => {
      dispatch(Action.createModel(form));
    },
    spinLogo: () => {
      dispatch(Action.spinLogo());
    },
    toggleProjectExpander: () => {
      dispatch(Action.toggleExpander("newProjectExpander"));
      // dispatch(Action.spinLogo());
    }
  }
);

MainContent = connect(mapStateToProps, mapDispatchToProps)(MainContent);

ReactDOM.render(
  <Provider store={store}>
    <MainContent root={location.host + location.pathname} />
  </Provider>,
  document.getElementById('content')
);
