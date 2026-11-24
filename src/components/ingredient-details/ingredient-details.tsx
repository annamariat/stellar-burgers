import { selectIngredients } from '@selectors/ingredientsSelectors';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import { useSelector } from '@services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams();
  const ingredientData = useSelector(selectIngredients).find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
