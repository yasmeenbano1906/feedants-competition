import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  BackHandler,
} from "react-native";

import {
  getCompetition,
  getRegistrationStatus,
  joinCompetition,
} from "../services/api";

const COMPETITION_ID = "6ab2bb00195474e4af150ce2";
const USER_ID = "6ab2bbcaf15830ecfba89778";

export default function CompetitionDetailsScreen() {
  const [competition, setCompetition] = useState(null);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [activeTab, setActiveTab] = useState("about");

  const loadData = async () => {
    try {
      const competitionResponse =
        await getCompetition(COMPETITION_ID);

      const registrationResponse =
        await getRegistrationStatus(
          COMPETITION_ID,
          USER_ID
        );

      setCompetition(competitionResponse.data);
      setJoined(registrationResponse.joined);
    } catch (error) {
      Alert.alert("Error", "Failed to load competition.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!competition) return;

    const updateCountdown = () => {
      const end = new Date(competition.endDate);
      const diff = end - new Date();

      if (diff <= 0) {
        setTimeLeft("Competition ended");
        return;
      }

      const days = Math.floor(
        diff / (1000 * 60 * 60 * 24)
      );
      const hours = Math.floor(
        (diff / (1000 * 60 * 60)) % 24
      );
      const minutes = Math.floor(
        (diff / (1000 * 60)) % 60
      );
      const seconds = Math.floor(
        (diff / 1000) % 60
      );

      setTimeLeft(
        `${String(days).padStart(2, "0")}d : ${String(
          hours
        ).padStart(2, "0")}h : ${String(
          minutes
        ).padStart(2, "0")}m : ${String(
          seconds
        ).padStart(2, "0")}s`
      );
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [competition]);

  const handleJoin = async () => {
    try {
      setJoining(true);

      await joinCompetition(
        COMPETITION_ID,
        USER_ID
      );

      setJoined(true);
      await loadData();

      Alert.alert(
        "Success",
        "You joined the competition!"
      );
    } catch (error) {
      Alert.alert(
        "Unable to Join",
        error.response?.data?.message ||
        "Something went wrong."
      );
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loading}>
          Loading competition...
        </Text>
      </View>
    );
  }

  if (!competition) {
    return (
      <View style={styles.center}>
        <Text>Competition not found.</Text>
      </View>
    );
  }

  const spotsLeft =
    competition.maxParticipants -
    competition.currentParticipants;

  const isFull = spotsLeft <= 0;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "2-digit",
      }
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => Alert.alert("Go Back", "Back button pressed")}
          >
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert("Go Back", "Back button pressed")}
          >
            <Text style={styles.goBack}>Go back</Text>
          </TouchableOpacity>

          <View style={styles.language}>
            <Text style={styles.activeLanguage}>
              ENG
            </Text>
            <Text style={styles.hindi}>हिंदी</Text>
          </View>
        </View>

        {/* COMPETITION CARD */}
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                {competition.title}
              </Text>
              <View style={styles.tags}>
                {competition.tags?.map((tag) => (
                  <Text key={tag} style={styles.tag}>
                    {tag}
                  </Text>
                ))}
                <Text style={styles.certificate}>
                  🏆 Winners get certificate
                </Text>
              </View>
            </View>
            {joined && (
              <View style={styles.registered}>
                <Text style={styles.check}>✓</Text>
                <Text style={styles.registeredText}>
                  Registered
                </Text>
              </View>
            )}
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.smallLabel}>
                Prize Pool
              </Text>
              <Text style={styles.bigValue}>
                ₹ {competition.prize}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.smallLabel}>
                Entry Fee
              </Text>
              <Text style={styles.bigValue}>
                ₹ {competition.entryFee}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.smallLabel}>
                👥 Only {spotsLeft} spots left
              </Text>

              <View style={styles.progress}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(
                        (competition.currentParticipants /
                          competition.maxParticipants) *
                        100,
                        100
                      )}%`,
                    },
                  ]}
                />
              </View>

              <Text style={styles.booked}>
                {competition.currentParticipants} /{" "}
                {competition.maxParticipants} Booked
              </Text>
            </View>
          </View>
        </View>

        {/* JUDGE */}
        <View style={styles.card}>
          <View style={styles.judgeRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                MD
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.judgeLabel}>
                Judge
              </Text>
              <Text style={styles.judgeName}>
                {competition.judge?.name}
              </Text>
              <Text style={styles.judgeInfo}>
                {competition.judge?.profession}
              </Text>
              <Text style={styles.judgeInfo}>
                {competition.judge?.experience}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.videoButton}
              onPress={() =>
                Alert.alert(
                  "Intro Video",
                  "Competition introduction video will be available here."
                )
              }
            >
              <Text style={styles.play}>▶</Text>
              <Text style={styles.videoText}>
                Intro Video
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* COUNTDOWN */}
        <View style={styles.countdownBox}>
          <Text style={styles.hourglass}>⌛</Text>

          <View style={{ flex: 1 }}>
            <Text style={styles.countdownLabel}>
              Registration closes in
            </Text>
            <Text style={styles.countdown}>
              {timeLeft}
            </Text>
          </View>

          <Text style={styles.hurry}>⏱ Hurry up!</Text>
        </View>

        {/* IMPORTANT DATES */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Important Dates
          </Text>

          <View style={styles.dateGrid}>
            <DateItem
              icon="▣"
              title="Register Before"
              date={formatDate(competition.registrationDeadline)}
              time={new Date(
                competition.registrationDeadline
              ).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
            <DateItem
              icon="➤"
              title="Submission Starts"
              date={formatDate(competition.submissionStart)}
              time={new Date(
                competition.submissionStart
              ).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
            <DateItem
              icon="↥"
              title="Submission Ends"
              date={formatDate(competition.submissionEnd)}
              time={new Date(
                competition.submissionEnd
              ).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
            <DateItem
              icon="🏆"
              title="Result Date"
              date={formatDate(competition.resultDate)}
              time={new Date(
                competition.resultDate
              ).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          </View>
        </View>

        {/* PREVIOUS WINNERS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Previous Winners
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {competition.previousWinners?.map((winner, index) => (
              <View
                key={index}
                style={styles.winner}
              >
                <View style={styles.winnerImage}>
                  <Text style={styles.winnerEmoji}>
                    💃
                  </Text>
                </View>

                <View>
                  <Text style={styles.winnerName}>
                    {winner.name}
                  </Text>
                  <Text style={styles.winnerPosition}>
                    {winner.position}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ABOUT */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab("about")}
          >
            <Text
              style={
                activeTab === "about"
                  ? styles.activeTab
                  : styles.tab
              }
            >
              About Competition
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab("judging")}
          >
            <Text
              style={
                activeTab === "judging"
                  ? styles.activeTab
                  : styles.tab
              }
            >
              Judging Parameters
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab("rules")}
          >
            <Text
              style={
                activeTab === "rules"
                  ? styles.activeTab
                  : styles.tab
              }
            >
              Rules & Eligibility
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "about" && (
          <Text style={styles.about}>
            {competition.description}
          </Text>
        )}

        {activeTab === "judging" &&
          competition.judgingParameters?.map((item, index) => (
            <Text key={index} style={styles.about}>
              • {item}
            </Text>
          ))}

        {activeTab === "rules" &&
          competition.rules?.map((item, index) => (
            <Text key={index} style={styles.about}>
              • {item}
            </Text>
          ))}

        {/* REWARDS */}
        <View style={styles.card}>
          <View style={styles.rewardHeader}>
            <Text style={styles.sectionTitle}>
              Rewards
            </Text>
            <Text style={styles.allPositions}>
              (All Positions)
            </Text>
          </View>
          {competition.rewards?.map((reward, index) => (
            <Reward
              key={index}
              icon={
                index === 0
                  ? "🏆"
                  : index === 1
                    ? "🥈"
                    : index === 2
                      ? "🥉"
                      : "☆"
              }
              title={reward.position}
              amount={`₹ ${reward.amount}`}
            />
          ))}
        </View>

        {/* DISCLAIMER */}
        <View style={styles.disclaimer}>
          <Text style={styles.infoIcon}>ⓘ</Text>
          <Text style={styles.disclaimerText}>
            Disclaimer: Only contributions from paid
            participants will be considered for judging.
          </Text>
        </View>

        {/* PAYMENT */}
        <View style={styles.card}>
          <View style={styles.paymentRow}>
            <View style={styles.playBox}>
              <Text style={styles.play}>
                ▶
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.paymentTitle}>
                How will you receive
              </Text>
              <Text style={styles.paymentTitle}>
                prize money?
              </Text>
              <Text style={styles.paymentSub}>
                Watch video to know more
              </Text>
            </View>

            <View style={styles.paymentInfo}>
              <Text>🛡 Refund policy</Text>
              <Text style={{ marginTop: 18 }}>
                🛡 Secure payments
              </Text>
            </View>
          </View>
        </View>

        {/* REFER */}
        <View style={styles.refer}>
          <Text style={styles.referIcon}>📣</Text>

          <View style={{ flex: 1 }}>
            <Text style={styles.referTitle}>
              Refer & Earn more discount
            </Text>

            <View style={styles.linkBox}>
              <Text style={styles.link}>
                https://feedants.com/r/referral123
              </Text>
              <Text style={styles.copy}>
                Copy Link
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.referButton}
            onPress={() =>
              Alert.alert(
                "Refer & Earn",
                "Referral feature is ready for integration."
              )
            }
          >
            <Text style={styles.referText}>Refer Now</Text>
          </TouchableOpacity>
        </View>

        {/* USERS */}
        <View style={styles.card}>
          <View style={styles.userRow}>
            <Text style={styles.userIcon}>
              💬
            </Text>

            <View style={{ flex: 1 }}>
              <Text style={styles.userTitle}>
                Hear From Our Users
              </Text>
              <Text style={styles.userSub}>
                See what participants say about Feedants
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </View>
        </View>

        {/* AD */}
        <View style={styles.ad}>
          <Text style={styles.adIcon}>📢</Text>
          <Text style={styles.adText}>
            Ad Here
          </Text>
        </View>

        {/* ACTION */}
        {joined ? (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() =>
              Alert.alert(
                "Upload Submission",
                "Submission upload feature is ready for integration."
              )
            }
          >
            <Text style={styles.uploadTitle}>
              Upload Submission
            </Text>
            <Text style={styles.uploadSub}>
              Registered
            </Text>
          </TouchableOpacity>
        ) : competition.status === "active" &&
          !isFull ? (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleJoin}
            disabled={joining}
          >
            {joining ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.uploadTitle}>
                  Join Competition
                </Text>
                <Text style={styles.uploadSub}>
                  ₹{competition.entryFee} Entry Fee
                </Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.disabledButton}>
            <Text style={styles.uploadTitle}>
              Registration Unavailable
            </Text>
          </View>
        )}

        {/* BOTTOM NAV */}
        <View style={styles.bottomNav}>
          <NavItem icon="⌂" title="Home" />
          <NavItem icon="⌕" title="Explore" />

          <View style={styles.plus}>
            <Text style={styles.plusText}>+</Text>
          </View>

          <NavItem
            icon="🏆"
            title="Competitions"
          />

          <NavItem icon="●" title="Profile" />
        </View>
      </ScrollView>
    </View>
  );
}

function DateItem({ icon, title, date, time }) {
  return (
    <View style={styles.dateItem}>
      <Text style={styles.dateIcon}>{icon}</Text>

      <View>
        <Text style={styles.dateTitle}>
          {title}
        </Text>
        <Text style={styles.dateValue}>
          {date}
        </Text>
        <Text style={styles.dateTime}>
          {time}
        </Text>
      </View>
    </View>
  );
}

function Reward({ icon, title, amount }) {
  return (
    <View style={styles.reward}>
      <Text style={styles.rewardIcon}>
        {icon}
      </Text>

      <Text style={styles.rewardTitle}>
        {title}
      </Text>

      <Text style={styles.rewardAmount}>
        {amount}
      </Text>
    </View>
  );
}

function NavItem({ icon, title }) {
  return (
    <View style={styles.navItem}>
      <Text style={styles.navIcon}>{icon}</Text>
      <Text style={styles.navText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f7f9fa",
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loading: {
    marginTop: 10,
    color: "#666",
  },

  topBar: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  back: {
    fontSize: 35,
    color: "#152a50",
  },

  goBack: {
    fontSize: 17,
    fontWeight: "700",
    color: "#152a50",
    marginLeft: 5,
  },

  language: {
    marginLeft: "auto",
    flexDirection: "row",
    backgroundColor: "#eef1f5",
    borderRadius: 25,
    padding: 4,
  },

  activeLanguage: {
    backgroundColor: "#087f88",
    color: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    fontWeight: "700",
  },

  hindi: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#27324b",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#edf0f3",
  },

  titleRow: {
    flexDirection: "row",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#152a50",
  },

  registered: {
    backgroundColor: "#eaf7f8",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
  },

  check: {
    backgroundColor: "#087f88",
    color: "#fff",
    borderRadius: 20,
    paddingHorizontal: 5,
    marginRight: 5,
  },

  registeredText: {
    color: "#087f88",
    fontWeight: "700",
  },

  tags: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 10,
  },

  tag: {
    backgroundColor: "#f1f3f7",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    marginRight: 8,
    color: "#27324b",
    fontWeight: "600",
  },

  certificate: {
    color: "#087f88",
    fontWeight: "600",
    marginTop: 5,
  },

  summaryRow: {
    flexDirection: "row",
    marginTop: 20,
  },

  summaryItem: {
    flex: 1,
    marginRight: 10,
  },

  smallLabel: {
    color: "#687493",
    fontSize: 13,
    marginBottom: 5,
  },

  bigValue: {
    fontSize: 25,
    fontWeight: "800",
    color: "#087f88",
  },

  progress: {
    height: 6,
    backgroundColor: "#dceff0",
    borderRadius: 5,
    marginTop: 8,
  },

  progressFill: {
    height: 6,
    backgroundColor: "#087f88",
    borderRadius: 5,
  },

  booked: {
    color: "#687493",
    fontSize: 12,
    marginTop: 7,
  },

  judgeRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#e6d8d0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  avatarText: {
    fontSize: 23,
    fontWeight: "800",
    color: "#7b4b3d",
  },

  judgeLabel: {
    color: "#687493",
    fontSize: 13,
  },

  judgeName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#152a50",
    marginVertical: 3,
  },

  judgeInfo: {
    color: "#687493",
    fontSize: 13,
    marginTop: 2,
  },

  videoButton: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  play: {
    fontSize: 23,
    color: "#087f88",
  },

  videoText: {
    color: "#687493",
    fontSize: 12,
    marginTop: 5,
  },

  countdownBox: {
    backgroundColor: "#eaf7f8",
    borderRadius: 13,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  hourglass: {
    fontSize: 25,
    marginRight: 12,
  },

  countdownLabel: {
    color: "#152a50",
    fontWeight: "700",
  },

  countdown: {
    color: "#087f88",
    fontWeight: "900",
    fontSize: 20,
    marginTop: 3,
  },

  hurry: {
    color: "#087f88",
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#152a50",
    marginBottom: 12,
  },

  dateGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: "#e5e9ef",
    borderRadius: 10,
  },

  dateItem: {
    width: "50%",
    flexDirection: "row",
    padding: 14,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#e5e9ef",
  },

  dateIcon: {
    fontSize: 22,
    color: "#087f88",
    marginRight: 10,
  },

  dateTitle: {
    color: "#687493",
    fontSize: 12,
  },

  dateValue: {
    color: "#087f88",
    fontWeight: "800",
    marginTop: 3,
  },

  dateTime: {
    color: "#152a50",
    fontWeight: "600",
    marginTop: 2,
  },

  winner: {
    width: 190,
    marginRight: 10,
    padding: 8,
    backgroundColor: "#f6f8fa",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  winnerImage: {
    width: 55,
    height: 55,
    borderRadius: 8,
    backgroundColor: "#d9b38c",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 9,
  },

  winnerEmoji: {
    fontSize: 25,
  },

  winnerName: {
    fontWeight: "700",
    color: "#152a50",
  },

  winnerPosition: {
    color: "#087f88",
    fontSize: 12,
    marginTop: 4,
  },

  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#e2e6eb",
    marginBottom: 14,
  },

  activeTab: {
    color: "#087f88",
    fontWeight: "800",
    paddingBottom: 10,
    borderBottomWidth: 3,
    borderColor: "#087f88",
    flex: 1,
    textAlign: "center",
  },

  tab: {
    color: "#687493",
    fontWeight: "600",
    paddingBottom: 10,
    flex: 1,
    textAlign: "center",
  },

  about: {
    color: "#687493",
    fontSize: 15,
    lineHeight: 23,
  },

  viewMore: {
    textAlign: "center",
    color: "#087f88",
    fontWeight: "700",
    marginTop: 10,
  },

  rewardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  allPositions: {
    color: "#687493",
    marginLeft: 8,
    marginBottom: 12,
  },

  reward: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderColor: "#edf0f3",
  },

  rewardIcon: {
    width: 35,
    fontSize: 20,
  },

  rewardTitle: {
    flex: 1,
    color: "#152a50",
    fontWeight: "700",
  },

  rewardAmount: {
    color: "#087f88",
    fontWeight: "800",
    fontSize: 17,
  },

  disclaimer: {
    backgroundColor: "#eaf7f8",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  infoIcon: {
    fontSize: 20,
    color: "#087f88",
    marginRight: 8,
  },

  disclaimerText: {
    flex: 1,
    color: "#152a50",
    fontSize: 12,
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  playBox: {
    width: 65,
    height: 65,
    backgroundColor: "#d9f4e8",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  paymentTitle: {
    color: "#152a50",
    fontWeight: "800",
  },

  paymentSub: {
    color: "#687493",
    fontSize: 12,
    marginTop: 6,
  },

  paymentInfo: {
    color: "#152a50",
    fontSize: 12,
  },

  refer: {
    backgroundColor: "#e2f8e9",
    borderRadius: 13,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  referIcon: {
    fontSize: 30,
    marginRight: 10,
  },

  referTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#152a50",
    marginBottom: 7,
  },

  linkBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 7,
    overflow: "hidden",
  },

  link: {
    flex: 1,
    fontSize: 10,
    padding: 9,
    color: "#687493",
  },

  copy: {
    padding: 9,
    color: "#087f88",
    fontWeight: "800",
  },

  referButton: {
    backgroundColor: "#087f88",
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 8,
    marginLeft: 8,
  },

  referButtonText: {
    color: "#fff",
    fontWeight: "800",
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  userIcon: {
    fontSize: 25,
    marginRight: 12,
  },

  userTitle: {
    fontWeight: "800",
    color: "#152a50",
  },

  userSub: {
    color: "#687493",
    fontSize: 11,
    marginTop: 4,
  },

  arrow: {
    fontSize: 30,
    color: "#152a50",
  },

  ad: {
    height: 55,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#b9c2d0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
  },

  adIcon: {
    marginRight: 8,
  },

  adText: {
    color: "#687493",
    fontWeight: "700",
  },

  uploadButton: {
    backgroundColor: "#087f88",
    borderRadius: 11,
    padding: 13,
    alignItems: "center",
    marginBottom: 10,
  },

  uploadTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },

  uploadSub: {
    color: "#fff",
    marginTop: 2,
    fontSize: 12,
  },

  disabledButton: {
    backgroundColor: "#9aa5ad",
    borderRadius: 11,
    padding: 17,
    alignItems: "center",
    marginBottom: 10,
  },

  bottomNav: {
    backgroundColor: "#fff",
    minHeight: 70,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 5,
  },

  navItem: {
    alignItems: "center",
  },

  navIcon: {
    fontSize: 23,
    color: "#087f88",
  },

  navText: {
    fontSize: 10,
    color: "#687493",
    marginTop: 3,
  },

  plus: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#087f88",
    justifyContent: "center",
    alignItems: "center",
  },

  plusText: {
    color: "#fff",
    fontSize: 30,
  },

  tabButton: {
    flex: 1,
  },
});