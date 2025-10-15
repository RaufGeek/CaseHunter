import { useState, useEffect } from "react";
import { LeaderboardEntry } from "@/types";

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Simulate loading leaderboard data
    const mockLeaderboard = [
      {
        id: 1,
        rank: 1,
        username: "TopPlayer",
        avatar: null,
        score: 15420,
        details: "Premium Member",
      },
      {
        id: 2,
        rank: 2,
        username: "ProGamer",
        avatar: null,
        score: 12850,
        details: "VIP Member",
      },
      {
        id: 3,
        rank: 3,
        username: "LuckyWinner",
        avatar: null,
        score: 11200,
        details: "Regular Player",
      },
      {
        id: 4,
        rank: 4,
        username: "CurrentUser",
        avatar: null,
        score: 8500,
        details: "Your Position",
        isCurrentUser: true,
      },
      {
        id: 5,
        rank: 5,
        username: "CasualPlayer",
        avatar: null,
        score: 7200,
        details: "Regular Player",
      },
    ];
    setLeaderboard(mockLeaderboard);
  }, []);

  return (
    <div id="leaderboard-page" className="page">
      <h2>Leaderboard</h2>

      <div id="leaderboard-list" className="leaderboard-list content-card">
        {leaderboard.map((player) => (
          <div
            key={player.id}
            className={`leader-entry ${
              player.isCurrentUser ? "current-user-entry" : ""
            }`}
          >
            <div className="rank">#{player.rank}</div>

            <div className="avatar-placeholder">
              {player.avatar ? (
                <img src={player.avatar} alt={player.username} />
              ) : (
                <span>{player.username.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className="info">
              <div className="name">{player.username}</div>
              <div className="details">{player.details}</div>
            </div>

            <div className="score">{player.score.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
