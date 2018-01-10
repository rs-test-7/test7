import React, {PureComponent} from 'react';
import {v4} from 'uuid';

export default class Clipped extends PureComponent {
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
    render() {
        const {x, y, width, height, children} = this.props;

        return (
            <Clipped path={<rect x={x} y={y} width={width} height={height}/>}>
                {children}
            </Clipped>
        );
    }
}