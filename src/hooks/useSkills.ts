import { useState, useEffect } from "react";
import api from "@/pages/api/axios";
import { Skill } from "@/pages/skills/components/SkillsTable";

interface FetchParams {
  page: number;
  search: string;
  sort: string;
  size: number;
}

export const useSkills = (initialParams: FetchParams) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialParams.page);
  const [searchValue, setSearchValue] = useState<string>(initialParams.search);
  const [sortValue, setSortValue] = useState<string>(initialParams.sort);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialParams.size);

  const fetchData = async (
    page: number = initialParams.page,
    search: string = initialParams.search,
    sort: string = initialParams.sort,
    size: number = initialParams.size
  ) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");

      const params: { [key: string]: any } = {
        page: page,
        size: size,
      };

      if (search.trim() !== "") {
        params.skillNome = search;
      }

      if (sort.trim() !== "") {
        params.sort = sort;
      }

      const response = await api.get(`associacoes/usuario/${userId}/skills`, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSkills(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchValue, sortValue, itemsPerPage);
  }, [currentPage, searchValue, sortValue, itemsPerPage]);

  return {
    skills,
    totalPages,
    currentPage,
    itemsPerPage,
    searchValue,
    setItemsPerPage,
    setSearchValue,
    setSortValue,
    fetchData,
    setSkills,
    nextPage: () => {
      if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1);
      }
    },
    prevPage: () => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    },
  };
};
