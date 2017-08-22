import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Sound from "react-sound";

import styles from "styles/Main.scss";

class Main extends React.Component<void, void, void> {
  constructor() {
    super();
    this.state = {
      racers: [
        { name: "ben", position: 0, time: Infinity },
        { name: "bert", position: 0, time: Infinity },
        { name: "brandt", position: 0, time: Infinity },
        { name: "celia", position: 0, time: Infinity },
        { name: "chris", position: 0, time: Infinity },
        { name: "dave", position: 0, time: Infinity },
        { name: "eric", position: 0, time: Infinity },
        { name: "jake", position: 0, time: Infinity },
        { name: "kat", position: 0, time: Infinity },
        { name: "laura", position: 0, time: Infinity },
        { name: "patrick", position: 0, time: Infinity },
        { name: "phil", position: 0, time: Infinity },
        { name: "tia", position: 0, time: Infinity },
        { name: "tori", position: 0, time: Infinity }
      ],
      winner: null,
      showOrder: false,
      started: false
    };

    this.raceDelayMS = 500;
    this.maxAdvance = 3;
    this.minAdvance = -2;
    this.startRace = this.startRace.bind(this);
    this.raceDone = this.raceDone.bind(this);
  }

  startRace() {
    this.setState(
      {
        started: true
      },
      () => {
        this.race();
      }
    );
  }

  raceDone() {
    return (
      this.state.racers.filter(racer => racer.position >= 100).length >=
      this.state.racers.length - 1
    );
  }

  randomAdvance() {
    return (
      Math.random() * (this.maxAdvance - this.minAdvance) + this.minAdvance
    );
  }

  race() {
    if (!this.raceDone()) {
      this.setState(
        prevState => ({
          racers: prevState.racers.map(racer => {
            const advancement = racer.position + this.randomAdvance();
            return {
              ...racer,
              position: racer.position < 100 ? advancement : racer.position,
              time:
                racer.time === Infinity && advancement >= 100
                  ? Date.now()
                  : racer.time
            };
          })
        }),
        () => {
          const winner =
            this.state.winner ||
            this.state.racers.find(racer => racer.position >= 100);
          if (winner) {
            this.setState(
              {
                winner
              },
              () => {
                setTimeout(() => this.race(), this.raceDelayMS);
              }
            );
          } else {
            setTimeout(() => this.race(), this.raceDelayMS);
          }
        }
      );
    } else {
      setTimeout(() => {
        this.setState({
          showOrder: true
        });
      }, 3000);
    }
  }

  buildRacerImageUrl(name) {
    return `url(assets/${name}.jpg)`;
  }

  render() {
    return (
      <div className={styles.wrapper}>
        {!this.state.started &&
          <div className={styles.start} onClick={this.startRace}>
            RACE!
          </div>}
        <div className={styles.track}>
          {this.state.racers.map((racer, index) =>
            <div
              className={styles.racer}
              key={index}
              style={{
                backgroundImage: this.buildRacerImageUrl(racer.name),
                left: `${racer.position}%`
              }}
            >
              <div className={styles.racerName}>
                {racer.name}
              </div>
            </div>
          )}
          <div className={styles.finish}>FINISH</div>
        </div>
        <ReactCSSTransitionGroup
          transitionName={{
            enter: styles.winnerEnter,
            enterActive: styles.winnerEnterActive
          }}
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}
        >
          {this.raceDone() &&
            <div
              className={`${styles.card}
                ${(this.state.showOrder && styles.showOrder) || ""}`}
            >
              <div
                className={styles.winner}
                style={{
                  backgroundImage: this.buildRacerImageUrl(
                    this.state.winner.name
                  )
                }}
              >
                <div className={styles.winnerName}>WINNER</div>
              </div>
              <div className={styles.order}>
                {this.state.racers
                  .slice()
                  .sort((racer1, racer2) => racer1.time - racer2.time)
                  .map((racer, index) =>
                    <div key={index} className={styles.draftName}>
                      {index + 1}. {racer.name}
                    </div>
                  )}
              </div>
            </div>}
        </ReactCSSTransitionGroup>
        <Sound url="assets/race.mp3" playStatus={Sound.status.PLAYING} />
      </div>
    );
  }
}

export default Main;
