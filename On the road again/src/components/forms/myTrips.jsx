import React from 'react';
import { Trip } from './trip';
import { AddTripButton } from './buttons/addTripButton';

export function MyTrips() {
    return (
      <div>
        <AddTripButton/>
        <div className='roadbook'>
        <Trip />
        <Trip />
        <Trip />
        <Trip />
        <Trip />
      </div>
      </div>
    );
  }