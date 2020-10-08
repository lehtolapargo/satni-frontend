import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { multilingualconceptListsByNames, dictBackend2Frontend } from 'utils';
import DictArticle from './DictArticle';
import TermWikiArticle from './TermWikiArticle';

const useStyles = makeStyles(theme => ({
  articles: {
    height: '80vh',
    overflowY: 'auto',
    paddingRight: theme.spacing(2)
  },
  list: {
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(2)
  }
}));

// {Object.keys(articlesMappedByLanguagePair).map((langpair, index) => {

const Articles = ({data, lemma}) => {
  const classes = useStyles();
  const { dictEntryList, conceptList } = data;
  const termsByNames = multilingualconceptListsByNames(conceptList);
  return (
    <div className={classes.articles}>
      {dictEntryList && dictEntryList.map((dictEntry, index) => (
        <DictArticle
          dictGroup={dictBackend2Frontend(dictEntry)}
          lemma={lemma}
          key={index}
        />
      ))}
      {conceptList && Object.keys(termsByNames).map((name, index) => (
        <TermWikiArticle
          key={index}
          category={name.split(':')[0]}
          concepts={termsByNames[name]}
          lemma={lemma}
        />
      ))}
    </div>
  );
};

export default Articles;
