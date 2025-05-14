import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './SearchItem.module.scss';

function SearchItem({ data }) {
    return (
        <Link to={`/@${data.title}`} className={styles.wrapper}>
            <image className={styles.poster} src={data.poster} alt={data.title} />
            <div className={styles.info}>
                <h4 className={styles.title}>
                    <span>{data.title}</span>
                </h4>
            </div>
        </Link>
    );
}

SearchItem.propTypes = {
    data: PropTypes.object.isRequired,
};

export default SearchItem;
