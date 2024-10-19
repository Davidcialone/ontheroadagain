import React from 'react';
import { HomeCarousel } from './homeCarousel';


export function Home() {
    return (
      <div>
       <p>
            Bienvenue sur notre site de voyage! Découvrez les voyages de nos
            utilisateurs et partagez vos propres aventures.
        </p>
        <HomeCarousel />
        <p>
            Envie de revivre vos voyages comme si vous y étiez ? 
            Plongez dans vos plus belles aventures grâce à notre plateforme,
            où chaque souvenir prend vie. Parcourez vos photos, revivez chaque instant et 
            partagez vos expériences inoubliables avec ceux que vous aimez. 
            Transformez vos souvenirs en récits vivants et laissez chaque voyage 
            vous transporter à nouveau, comme si c'était hier. ✨
        </p>
      </div>
    );
  }
  