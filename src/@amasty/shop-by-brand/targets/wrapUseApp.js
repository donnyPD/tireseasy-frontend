import addAmHTMLContentTypeConfig from '../src/renderers/pageBuilder/addAmHTMLContentTypeConfig';
import { useEffect } from 'react';

const wrapUseApp = original => props => {
  const defaultReturnData = original(props);

  useEffect(() => addAmHTMLContentTypeConfig(), []);

  return defaultReturnData;
};

export default wrapUseApp;
