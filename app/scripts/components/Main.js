import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import styles from "styles/Main.scss";

class Main extends React.Component<void, void, void> {
  constructor() {
    super();
    this.state = {
      racers: [
        { name: "ben", position: 0 },
        { name: "bert", position: 0 },
        { name: "brandt", position: 0 },
        { name: "celia", position: 0 },
        { name: "chris", position: 0 },
        { name: "dave", position: 0 },
        { name: "eric", position: 0 },
        { name: "jake", position: 0 },
        { name: "kat", position: 0 },
        { name: "laura", position: 0 },
        { name: "patrick", position: 0 },
        { name: "phil", position: 0 },
        { name: "tia", position: 0 },
        { name: "tori", position: 0 }
      ],
      winner: null,
      showOrder: false,
      started: false
    };

    this.maxAdvance = 3;
    this.minAdvance = -2;
    this.startRace = this.startRace.bind(this);
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

  winner() {
    return this.state.racers.find(racer => racer.position >= 100);
  }

  randomAdvance() {
    return (
      Math.random() * (this.maxAdvance - this.minAdvance) + this.minAdvance
    );
  }

  race() {
    const winner = this.winner();
    if (!winner) {
      this.setState(
        prevState => ({
          racers: prevState.racers.map(racer => ({
            ...racer,
            position: racer.position + this.randomAdvance()
          }))
        }),
        () => setTimeout(() => this.race(), 500)
      );
    } else {
      this.setState(
        {
          winner
        },
        () => {
          setTimeout(() => {
            this.setState({
              showOrder: true
            });
          }, 3000);
        }
      );
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
          {this.state.winner &&
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
                  .sort((racer1, racer2) => racer2.position - racer1.position)
                  .map((racer, index) =>
                    <div key={index} className={styles.draftName}>
                      {index + 1}. {racer.name}
                    </div>
                  )}
              </div>
            </div>}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default Main;
