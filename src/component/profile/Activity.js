import React, { useState, useEffect, useSyncExternalStore } from 'react'
// import { toast } from "react-toastify";
import api from "../../services/axios-config";
import { isAxiosError } from "axios";
import moment from 'moment';

const Activity = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [prompt, setPromts] = useState([]);

  useEffect(() => {
    getPropmts();
    getPropmtsReview();
  }, [])

  const getPropmts = async () => {
    try {
      const promptsResponse = await api.get(`/code?userId=${userData.id}`);
      const prompts = promptsResponse.data.prompts;
      if (!prompts) {
        // toast.error("Failed to fetch prompts");
        return;
      }
      if (prompts.length > 0) {
        const {
          data: { code },
        } = await api.get(
          `/code/prompt-code?userId=${userData.id}&promptId=${prompts[0].id}`
        );

        if (!code) {
          // toast.error("Failed to fetch prompt code");
          return;
        }
        setPromts(prompts);
      }

    } catch (error) {
      if (isAxiosError(error) && error.response) {
        // toast.error(error.response.data.message);
      } else {
        // toast.error(error.message);
      }
    }
  }

  const [promptsReview, setPromptsReview] = useState([]);

  const getPropmtsReview = async () => {
    try {
      const response = await api.get(`/code/prompt-reviews?userId=${userData.id}`);
      //const response = await api.get(`/code/prompt-reviews?userId=8cce31a9-d630-49dd-8a8c-652528adf45f`);
      const data = response.data.promptReviews;
      if (!data) {
        // toast.error("Failed to fetch prompts review");
        return;
      }
      setPromptsReview(data);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        // toast.error(error.response.data.message);
      } else {
        // toast.error(error.message);
      }
    }
  };

  return (
    <>
      <div className="tab-pane fade" id="activity" role="tabpanel" aria-labelledby="activity-tab">
        <div className="inner_text sign_up_img">
          <h5 className="mb-0">
            <b>Generated codes</b>
          </h5>
          <div className="row">
            <div className="col-12 generate_code">
              <ul className="mt-3 pt-1">
                {prompt.slice(0, 10).map((prompt) => (
                  <li key={prompt.id} className="code_card">
                    <p className="mb-1">
                      <b>{prompt.prompt}</b>
                    </p>

                    <p className="m-0"> {moment(prompt.createdAt).format('MMMM DD, YYYY')}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h5 class="mb-0 mt-5 pt-3"><b>Requests for review</b></h5>
          <div class="row request_table">
            <div class="col-12 mt-3 pt-1">
              <table class="table">
                <thead>
                  <tr>
                    <th class="text-nowrap text-start">Code submission</th>
                    <th class="text-nowrap text-center">Priority</th>
                    <th class="text-nowrap text-center">Credits used</th>
                    <th class="text-nowrap text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {promptsReview.map((review) => (
                    <tr key={review.id}>
                      <td class="text-start"><b>{review.Prompt.prompt}</b></td>
                      <td class="text-center">{review.Subscription.title}</td>
                      <td class="text-center">{review.Subscription.price}</td>
                      <td class="text-center"><b>{review.status}</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Activity; 