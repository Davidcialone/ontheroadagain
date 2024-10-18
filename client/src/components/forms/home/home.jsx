import React from 'react';
import {NavbarSite} from './navbar';
import { HomeCarousel } from './homeCarousel';

export function Home() {
    return (
      <div>
        <p>
          Bienvenue sur notre site de voyage! Découvrez les voyages de nos
          utilisateurs et partagez vos propres aventures.
        </p>
        <HomeCarousel />
      </div>
    );
  }
  