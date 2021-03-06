import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Trans } from '@lingui/macro';
import { useQuery } from '@apollo/client';

import gql from 'graphql-tag';
import LanguageIcon from '@material-ui/icons/Language';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import PresentArticles from './PresentArticles';

const useStyles = makeStyles(() => ({
  icons: {
    fontSize: 'inherit'
  }
}));

const Articles = ({ lemma, wantedDicts, wantedLangs }) => {
  const classes = useStyles();

  const GET_ARTICLES = wantedDicts.includes('termwiki') ?
    gql`
      query AllArticles($lemma: String!, $wantedLangs: [String]!, $wantedDicts: [String]!) {
        dictEntryList (exact: $lemma, wanted: $wantedLangs, wantedDicts: $wantedDicts) {
          dictName
          srcLang
          targetLang
          lookupLemmas {
            edges {
              node {
                lemma
                presentationLemma
                language
                pos
                dialect
                country
              }
            }
          }
          translationGroups {
            translationLemmas {
              edges {
                node {
                  lemma
                  presentationLemma
                  language
                  pos
                  dialect
                  country
                }
              }
            }
            restriction {
              restriction
              attributes
            }
            exampleGroups {
              example
              translation
            }
          }
        }
        conceptList(exact: $lemma, wanted: $wantedLangs) {
          name
          collections
          definition
          explanation
          terms {
            note
            source
            status
            expression {
              lemma
              presentationLemma
              language
              pos
              dialect
              country
            }
          }
        }
      }
    ` :
    gql`
      query AllArticles($lemma: String!, $wantedLangs: [String]!, $wantedDicts: [String]!) {
        dictEntryList (exact: $lemma, wanted: $wantedLangs, wantedDicts: $wantedDicts) {
          dictName
          srcLang
          targetLang
          lookupLemmas {
            edges {
              node {
                lemma
                presentationLemma
                language
                pos
                dialect
                country
              }
            }
          }
          translationGroups {
            translationLemmas {
              edges {
                node {
                  lemma
                  presentationLemma
                  language
                  pos
                  dialect
                  country
                }
              }
            }
            restriction {
              restriction
              attributes
            }
            exampleGroups {
              example
              translation
            }
          }
        }
      }
    `;

  const {data, loading, error} = useQuery(
    GET_ARTICLES, {
      variables: {
        lemma,
        wantedLangs,
        wantedDicts
      }
    }
  );
  if (loading) return <Trans><p>Loading...</p></Trans>;
  if (error) return <Trans><p>Error {error.message}</p></Trans>;
  if (!data) return <Trans><p>Not found</p></Trans>;

  if (
    (
      wantedDicts.includes('termwiki') &&
      !data.dictEntryList.length &&
      !data.conceptList.length
    ) ||
    (
      !wantedDicts.includes('termwiki') &&
      !data.dictEntryList.length
    )
  ) {
    return <Typography
      component='p'
      className={classes.list}
    >
      <Trans>
      No results for <b>{lemma}</b>. Check <LanguageIcon className={classes.icons} /> or <MenuBookIcon className={classes.icons} /> in the left menu to see if the wanted languages or dictionaries are selected.
      </Trans>
    </Typography>;
  }

  return <PresentArticles
    lemma={lemma}
    data={data} />;
};

Articles.propTypes = {
  lemma: PropTypes.string.isRequired,
  wantedDicts: PropTypes.array.isRequired,
  wantedLangs: PropTypes.array.isRequired
};

export default Articles;
