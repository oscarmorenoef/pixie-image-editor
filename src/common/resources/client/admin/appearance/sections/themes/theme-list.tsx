import {NavLink, useNavigate} from 'react-router-dom';
import {Fragment, useEffect} from 'react';
import {
  appearanceState,
  AppearanceValues,
} from '@common/admin/appearance/appearance-store';
import {AppearanceButton} from '@common/admin/appearance/appearance-button';
import {Button} from '@ui/buttons/button';
import {AddIcon} from '@ui/icons/material/Add';
import {Trans} from '@ui/i18n/trans';
import {useFieldArray} from 'react-hook-form';
import {useTrans} from '@ui/i18n/use-trans';
import {message} from '@ui/i18n/message';
import {randomNumber} from '@ui/utils/string/random-number';
import {useBootstrapDataStore} from '@ui/bootstrap-data/bootstrap-data-store';

export function ThemeList() {
  const {trans} = useTrans();
  const navigate = useNavigate();
  const themes = useBootstrapDataStore(s => s.data.themes);
  const {fields, append} = useFieldArray<
    AppearanceValues,
    'appearance.themes.all',
    'key'
  >({
    name: 'appearance.themes.all',
    keyName: 'key',
  });

  useEffect(() => {
    if (themes.selectedThemeId) {
      appearanceState().preview.setActiveTheme(themes.selectedThemeId);
    }
  }, [themes.selectedThemeId]);

  return (
    <Fragment>
      <div className="mb-20">
        <Button
          size="xs"
          variant="outline"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            const lightThemeColors =
              appearanceState().defaults?.appearance.themes.light!;
            append({
              id: randomNumber(),
              name: trans(message('New theme')),
              values: lightThemeColors,
            });
            navigate(`${fields.length + 1}`);
          }}
        >
          <Trans message="New theme" />
        </Button>
      </div>
      {fields.map((field, index) => (
        <AppearanceButton key={field.key} to={`${index}`} elementType={NavLink}>
          {field.name}
        </AppearanceButton>
      ))}
    </Fragment>
  );
}
