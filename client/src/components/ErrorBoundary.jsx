import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // Cette méthode est appelée lorsque qu'une erreur est lancée dans un composant enfant
  static getDerivedStateFromError(error) {
    // Mettre à jour l'état pour afficher l'UI de repli
    return { hasError: true };
  }

  // Cette méthode est appelée pour enregistrer l'erreur
  componentDidCatch(error, errorInfo) {
    // Tu peux enregistrer l'erreur dans un service de rapport d'erreurs
    console.error("Erreur capturée dans Error Boundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Tu peux afficher n'importe quel UI de repli ici
      return <h1>Quelque chose s'est mal passé.</h1>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
