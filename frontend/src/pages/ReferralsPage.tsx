import { useState, useEffect } from "react";

const ReferralsPage: React.FC = () => {
  const [referralBalance, setReferralBalance] = useState<number>(0);
  const [invitedCount, setInvitedCount] = useState<number>(0);
  const [referralLink, setReferralLink] = useState<string>("Loading...");

  useEffect(() => {
    // Simulate loading referral data
    setReferralBalance(150);
    setInvitedCount(3);
    setReferralLink("https://t.me/CaseHunterBot?start=ref123456");
  }, []);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    // You could add a toast notification here
  };

  const invitedFriends = [
    { id: 1, username: "friend1", joinedDate: "2024-01-15" },
    { id: 2, username: "friend2", joinedDate: "2024-01-20" },
    { id: 3, username: "friend3", joinedDate: "2024-01-25" },
  ];

  return (
    <div id="invite-page" className="page">
      <h2>Рефералы</h2>

      <div className="content-card">
        <p>
          Приглашайте друзей и зарабатывайте 5 звезд за каждого друга + 10% от
          его депозитов!
        </p>

        <input type="text" id="referral-link" value={referralLink} readOnly />

        <button
          id="copy-ref-link-button"
          className="button"
          onClick={copyReferralLink}
        >
          Copy Code
        </button>

        <div className="stats-box">
          <div className="stat-item">
            <div id="referral-balance" className="value">
              {referralBalance}{" "}
              <img
                src="https://images.casehunter.sbs/DMJTGStarsEmoji_AgADZxIAAjoUmVI.png"
                className="balance-icon"
                style={{
                  width: "1em",
                  height: "1em",
                  verticalAlign: "text-bottom",
                }}
                alt="Star"
              />
            </div>
            <div className="label">Earnings</div>
          </div>
          <div className="stat-item">
            <div id="invited-count" className="value">
              {invitedCount}
            </div>
            <div className="label">Invited</div>
          </div>
        </div>

        <button
          id="withdraw-referral-button"
          className="button button-secondary"
        >
          Вывести на баланс
        </button>
      </div>

      <div className="content-card">
        <h3>Invited Friends</h3>
        <div id="invited-users-list-display" className="invited-users-list">
          {invitedFriends.length > 0 ? (
            invitedFriends.map((friend) => (
              <div key={friend.id}>
                <strong>{friend.username}</strong> - Joined: {friend.joinedDate}
              </div>
            ))
          ) : (
            <p>No friends invited yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;
