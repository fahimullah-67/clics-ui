"use client"

import { useState } from "react"
import { Button } from "../components/custom-ui/Button"
import { Card } from "../components/custom-ui/Card"
import { Badge } from "../components/custom-ui/Badge"
import { Textarea } from "../components/custom-ui/Textarea"

export default function ReviewsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    comment: "",
    category: "bank",
  })

  // Mock reviews data
  const [reviews, setReviews] = useState([
    {
      id: 1,
      userName: "Priya Sharma",
      userAvatar: "PS",
      rating: 5,
      title: "Excellent Home Loan Service",
      comment:
        "SBI provided amazing service for my home loan. The process was smooth and the interest rates were competitive.",
      category: "bank",
      bankName: "State Bank of India",
      date: "2 days ago",
      helpful: 24,
      verified: true,
    },
    {
      id: 2,
      userName: "Rahul Kumar",
      userAvatar: "RK",
      rating: 4,
      title: "Good Investment Scheme",
      comment: "The PPF scheme has been great for long-term savings. Easy to manage and good returns.",
      category: "scheme",
      schemeName: "Public Provident Fund",
      date: "5 days ago",
      helpful: 18,
      verified: true,
    },
    {
      id: 3,
      userName: "Anjali Verma",
      userAvatar: "AV",
      rating: 3,
      title: "Average Experience",
      comment: "HDFC service is okay but the waiting time for loan approval was quite long.",
      category: "bank",
      bankName: "HDFC Bank",
      date: "1 week ago",
      helpful: 12,
      verified: false,
    },
    {
      id: 4,
      userName: "Vikram Singh",
      userAvatar: "VS",
      rating: 5,
      title: "Best Fixed Deposit Rates",
      comment: "Highly recommend this FD scheme. Great interest rates and flexible tenure options.",
      category: "scheme",
      schemeName: "Fixed Deposit",
      date: "2 weeks ago",
      helpful: 31,
      verified: true,
    },
    {
      id: 5,
      userName: "Neha Patel",
      userAvatar: "NP",
      rating: 4,
      title: "Quick Loan Processing",
      comment: "ICICI processed my personal loan within 48 hours. Very efficient service.",
      category: "bank",
      bankName: "ICICI Bank",
      date: "3 weeks ago",
      helpful: 22,
      verified: true,
    },
  ])

  const handleRatingClick = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }))
  }

  const handleSubmitReview = () => {
    if (!newReview.rating || !newReview.title || !newReview.comment) {
      alert("Please fill all fields and select a rating")
      return
    }

    const review = {
      id: Date.now(),
      userName: "You",
      userAvatar: "YO",
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      category: newReview.category,
      bankName: newReview.category === "bank" ? "Your Bank" : undefined,
      schemeName: newReview.category === "scheme" ? "Your Scheme" : undefined,
      date: "Just now",
      helpful: 0,
      verified: false,
    }

    setReviews((prev) => [review, ...prev])
    setShowReviewForm(false)
    setNewReview({ rating: 0, title: "", comment: "", category: "bank" })
  }

  const handleHelpful = (reviewId) => {
    setReviews((prev) =>
      prev.map((review) => (review.id === reviewId ? { ...review, helpful: review.helpful + 1 } : review)),
    )
  }

  const filteredReviews =
    selectedFilter === "all" ? reviews : reviews.filter((review) => review.category === selectedFilter)

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reviews & Ratings</h1>
        <p className="text-gray-600 mt-2">Share your experience and help others make informed decisions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Rating Summary */}
        <Card className="p-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-6 h-6 ${star <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600">Based on {reviews.length} reviews</p>
          </div>

          <div className="mt-6 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm text-gray-600 w-8">{rating} ★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${(ratingDistribution[rating] / reviews.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{ratingDistribution[rating]}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{reviews.length}</div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{reviews.filter((r) => r.verified).length}</div>
              <div className="text-sm text-gray-600">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {reviews.filter((r) => r.category === "bank").length}
              </div>
              <div className="text-sm text-gray-600">Bank Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {reviews.filter((r) => r.category === "scheme").length}
              </div>
              <div className="text-sm text-gray-600">Scheme Reviews</div>
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={() => setShowReviewForm(!showReviewForm)} className="w-full">
              Write a Review
            </Button>
          </div>
        </Card>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Write Your Review</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="flex gap-4">
                <Button
                  variant={newReview.category === "bank" ? "default" : "outline"}
                  onClick={() => setNewReview((prev) => ({ ...prev, category: "bank" }))}
                >
                  Bank
                </Button>
                <Button
                  variant={newReview.category === "scheme" ? "default" : "outline"}
                  onClick={() => setNewReview((prev) => ({ ...prev, category: "scheme" }))}
                >
                  Scheme
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => handleRatingClick(star)} className="focus:outline-none">
                    <svg
                      className={`w-10 h-10 cursor-pointer transition-colors ${
                        star <= newReview.rating ? "text-yellow-400" : "text-gray-300"
                      } hover:text-yellow-300`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Summarize your experience"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
              <Textarea
                value={newReview.comment}
                onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your detailed experience..."
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={handleSubmitReview}>Submit Review</Button>
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
        <Button variant={selectedFilter === "all" ? "default" : "outline"} onClick={() => setSelectedFilter("all")}>
          All Reviews
        </Button>
        <Button variant={selectedFilter === "bank" ? "default" : "outline"} onClick={() => setSelectedFilter("bank")}>
          Banks
        </Button>
        <Button
          variant={selectedFilter === "scheme" ? "default" : "outline"}
          onClick={() => setSelectedFilter("scheme")}
        >
          Schemes
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {review.userAvatar}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{review.userName}</h3>
                      {review.verified && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                  </div>

                  <Badge variant="outline">{review.category}</Badge>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                {(review.bankName || review.schemeName) && (
                  <p className="text-sm text-blue-600 mb-2">{review.bankName || review.schemeName}</p>
                )}
                <p className="text-gray-700 mb-4">{review.comment}</p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
