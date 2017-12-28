import React, {PropTypes, PureComponent} from 'react';
import {v4} from 'uuid';

export default class Clipped extends PureComponent {
   //todo propTypes

    _id = v4();

    render() {
        const {_id} = this,
            {path, children} = this.props;

        return (
            <g>
                <defs>
                    <clipPath id={_id}>
                        {path}
                    </clipPath>
                </defs>

                <g clipPath={`url(#${_id})`}>
                    {children}
                </g>
            </g>
        );
    }
};

export class RectClipped extends PureComponent {
    //todo propTypes

    render() {
        const {x, y, width, height, children} = this.props;

        return (
            <Clipped path={<rect x={x} y={y} width={width} height={height}/>}>
                {children}
            </Clipped>
        );
    }
}

