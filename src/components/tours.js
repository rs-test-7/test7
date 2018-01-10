import React, {Component, PureComponent} from 'react';
import classNames from 'classnames';
import {tours as toursConst} from '../constants/bracket';

export default class Tours extends Component {
    render() {
        const {count, tournamentType, svgHeight} = this.props,
            columns = [];

        for (var i = 0; i < count; i++) {
            const tourNumber = i + 1,
                isPaired = number => !(number % 2),
                currentStyle = isPaired(tourNumber) ? 'light' : 'dark',
                tourClasses = classNames('tour', currentStyle),
            //TODO закончить для de
            //tourWidth =  tournamentType === 1 && i > 0 && i < count - 1 ? '480px' : '225px';
                tourWidth = '225px';

            columns.push(<div className={tourClasses} style={{width: tourWidth, height: svgHeight}} key={i}>
                {toursConst.DEFAULT_TOUR_NAME.toValue(tourNumber)}
            </div>);
        }

        return (columns);
    }
}