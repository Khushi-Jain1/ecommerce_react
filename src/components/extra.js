const Extra = ({ ...filters }) => {
  return <div dangerouslySetInnerHTML={{ __html: filters.tab }} />;
};

export default Extra;
