import { useSelector } from 'react-redux';

const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { achievements, points, level } = useSelector((state: RootState) => state.achievements);

  return (
    <div className="profile-page">
      <h2>{user?.name}</h2>
      <div className="stats">
        <div>Уровень: {level}</div>
        <div>Очки: {points}</div>
      </div>

      <h3>Достижения</h3>
      <div className="achievements-grid">
        {achievements.map(ach => (
          <div key={ach.id} className={`achievement ${ach.earned ? 'earned' : 'locked'}`}>
            <div className="icon">{ach.icon}</div>
            <div className="info">
              <h4>{ach.name}</h4>
              <p>{ach.description}</p>
              {!ach.earned && (
                <progress value={ach.progress} max={ach.target}>
                  {ach.progress}/{ach.target}
                </progress>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;